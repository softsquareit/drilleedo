<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf',
    ];

    private const ALLOWED_EXTENSIONS = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf',
    ];

    private const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    public function __construct(
        private SluggerInterface $slugger,
        private string $targetDirectory
    ) {
    }

    public function upload(UploadedFile $file, ?string $subDirectory = null): string
    {
        // Valider le MIME type réel (détecté côté serveur, pas déclaré par le client)
        $mimeType = $file->getMimeType();
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES, true)) {
            throw new \InvalidArgumentException(
                sprintf('Type de fichier non autorisé : %s.', $mimeType ?? 'inconnu')
            );
        }

        // Valider l'extension
        $extension = $file->guessExtension();
        if (!$extension || !in_array(strtolower($extension), self::ALLOWED_EXTENSIONS, true)) {
            throw new \InvalidArgumentException(
                sprintf('Extension de fichier non autorisée : %s.', $extension ?? 'inconnue')
            );
        }

        // Valider la taille
        if ($file->getSize() > self::MAX_SIZE_BYTES) {
            throw new \InvalidArgumentException(
                sprintf('Fichier trop volumineux. Taille max : %d Mo.', self::MAX_SIZE_BYTES / 1024 / 1024)
            );
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename . '-' . uniqid() . '.' . $extension;

        $directory = $this->targetDirectory;
        if ($subDirectory) {
            $directory .= '/' . $subDirectory;
        }

        // Créer le dossier si absent
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $file->move($directory, $fileName);

        return $fileName;
    }

    /**
     * Delete an uploaded file by filename and subdirectory.
     */
    public function delete(string $filename, string $subDirectory = ''): void
    {
        $path = $this->targetDirectory;
        if ($subDirectory !== '') {
            $path .= '/' . $subDirectory;
        }
        $fullPath = $path . '/' . $filename;

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    public function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }
}
