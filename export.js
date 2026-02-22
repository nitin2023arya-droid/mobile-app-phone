function exportData() {

    if (!window.appReady) {
        alert("Device not ready");
        return;
    }

    const data = localStorage.getItem(Storage.KEY);

    if (!data) {
        alert("No data to export");
        return;
    }

    const fileName = "bullion_pro_backup.json";

    window.resolveLocalFileSystemURL(
        cordova.file.externalDataDirectory,
        function (dir) {

            dir.getFile(fileName, { create: true }, function (file) {

                file.createWriter(function (writer) {

                    writer.onwriteend = function () {
                        alert("Backup saved successfully");
                        console.log("Saved at:", file.nativeURL);
                    };

                    writer.onerror = function (err) {
                        console.error("Write error:", err);
                        alert("Export failed");
                    };

                    // Write TEXT instead of Blob (more stable in WebView)
                    writer.write(data);

                });

            });

        },
        function (err) {
            console.error("Directory error:", err);
            alert("Storage access failed");
        }
    );
}
