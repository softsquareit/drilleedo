<?php

namespace App\Controller\Trait;

use App\Service\FileUploader;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

/**
 * Centralises file-upload logic shared across controllers.
 *
 * Usage: add `use HandleUploadTrait;` to any AbstractController subclass.
 * The controller must expose `addFlash()` (already available via AbstractController).
 */
trait HandleUploadTrait
{
    /**
     * Upload a file and return its new filename.
     * If $file is null, return $existingFilename unchanged (edit flow).
     * On validation/move error, add a flash message and return null.
     *
     * @param UploadedFile|null $file            The uploaded file (may be null on edit)
     * @param string            $subDirectory    Upload sub-directory (e.g. 'logos', 'banners')
     * @param FileUploader      $fileUploader    Injected service
     * @param string|null       $existingFilename Current filename to keep when no new file is sent
     */
    protected function handleUpload(
        ?UploadedFile $file,
        string $subDirectory,
        FileUploader $fileUploader,
        ?string $existingFilename = null
    ): ?string {
        if ($file === null) {
            return $existingFilename;
        }

        try {
            return $fileUploader->upload($file, $subDirectory);
        } catch (\InvalidArgumentException $e) {
            $this->addFlash('error', $e->getMessage());
            return $existingFilename;
        } catch (FileException $e) {
            $this->addFlash('error', 'Erreur lors du téléversement du fichier. Veuillez réessayer.');
            return $existingFilename;
        }
    }

    /**
     * Upload a file and delete the old one on success.
     * Returns the new filename, or the existing one if no file was sent / on error.
     */
    protected function handleUploadReplace(
        ?UploadedFile $file,
        string $subDirectory,
        FileUploader $fileUploader,
        ?string $existingFilename = null
    ): ?string {
        if ($file === null) {
            return $existingFilename;
        }

        $newFilename = $this->handleUpload($file, $subDirectory, $fileUploader, $existingFilename);

        // Delete old file only when the upload actually succeeded
        if ($newFilename !== $existingFilename && $existingFilename !== null) {
            $fileUploader->delete($existingFilename, $subDirectory);
        }

        return $newFilename;
    }
}
