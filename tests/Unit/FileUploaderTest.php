<?php

namespace App\Tests\Unit;

use App\Service\FileUploader;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\AsciiSlugger;

class FileUploaderTest extends TestCase
{
    private string $tempDir;

    protected function setUp(): void
    {
        $this->tempDir = sys_get_temp_dir() . '/fileuploader_test_' . uniqid();
        mkdir($this->tempDir, 0755, true);
    }

    protected function tearDown(): void
    {
        // Clean up temp files (skip directories)
        foreach (glob($this->tempDir . '/*') ?: [] as $item) {
            if (is_file($item)) {
                unlink($item);
            }
        }
        foreach (glob($this->tempDir . '/sub/*') ?: [] as $item) {
            if (is_file($item)) {
                unlink($item);
            }
        }
        @rmdir($this->tempDir . '/sub');
        rmdir($this->tempDir);
    }

    private function makeUploader(): FileUploader
    {
        return new FileUploader(new AsciiSlugger(), $this->tempDir);
    }

    public function testGetTargetDirectory(): void
    {
        $uploader = $this->makeUploader();
        $this->assertSame($this->tempDir, $uploader->getTargetDirectory());
    }

    public function testDeleteIgnoresMissingFile(): void
    {
        $uploader = $this->makeUploader();
        // Should not throw
        $uploader->delete('nonexistent-file.png');
        $this->assertTrue(true); // No exception = pass
    }

    public function testDeleteRemovesExistingFile(): void
    {
        $filename = 'test-file.txt';
        $fullPath = $this->tempDir . '/' . $filename;
        file_put_contents($fullPath, 'content');

        $this->assertFileExists($fullPath);

        $uploader = $this->makeUploader();
        $uploader->delete($filename);

        $this->assertFileDoesNotExist($fullPath);
    }

    public function testDeleteWithSubdirectory(): void
    {
        $subDir = 'sub';
        $filename = 'sub-file.txt';
        $subPath = $this->tempDir . '/' . $subDir;
        mkdir($subPath, 0755, true);
        $fullPath = $subPath . '/' . $filename;
        file_put_contents($fullPath, 'content');

        $this->assertFileExists($fullPath);

        $uploader = $this->makeUploader();
        $uploader->delete($filename, $subDir);

        $this->assertFileDoesNotExist($fullPath);
    }

    public function testUploadRejectsDisallowedMimeType(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/non autorisé/i');

        // Create a temp text file
        $tempFile = $this->tempDir . '/test.txt';
        file_put_contents($tempFile, 'plain text content');

        $uploaded = new UploadedFile(
            $tempFile,
            'test.txt',
            'text/plain',
            null,
            true // bypass validation (test mode)
        );

        $this->makeUploader()->upload($uploaded);
    }

    public function testUploadRejectsOversizedFile(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/volumineux/i');

        // Write a minimal valid 1×1 PNG (passes MIME check) then pad beyond 10 MB
        $minimalPng = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        );
        $tempFile = $this->tempDir . '/big.png';
        file_put_contents($tempFile, $minimalPng . str_repeat('A', 10 * 1024 * 1024 + 1));

        $uploaded = new UploadedFile(
            $tempFile,
            'big.png',
            'image/png',
            null,
            true
        );

        $this->makeUploader()->upload($uploaded);
    }
}
