<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadsDir = "uploads/";
    if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);

    $file = $_FILES['fileToUpload'];
    $target = $uploadsDir . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $target)) {
        echo "Uploaded: " . htmlspecialchars($file['name']);
    } else {
        echo "Upload failed.";
    }
}
?>
