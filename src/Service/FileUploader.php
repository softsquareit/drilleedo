<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{
    public function __construct(
        private SluggerInterface $slugger,
        private string $targetDirectory
    ) {
    }

    public function upload(UploadedFile $file, ?string $subDirectory = null): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        try {
            $extension = $file->guessExtension();
        } catch (\Exception $e) {
            
            $extension = null;
        }

        if (!$extension) {
            $extension = $file->getClientOriginalExtension();
        }

        $fileName = $safeFilename.'-'.uniqid().'.'.$extension;
        
        $directory = $this->targetDirectory;
        if ($subDirectory) {
            $directory .= '/' . $subDirectory;
        }

        try {
            $file->move($directory, $fileName);
        } catch (FileException $e) {
            
            throw $e;
        }

        return $fileName;
    }

    public function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }
}
