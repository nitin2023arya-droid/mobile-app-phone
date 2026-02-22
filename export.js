function exportData() {

    if (!window.cordova) {
        alert("Export works only inside app");
        return;
    }

    document.addEventListener("deviceready", function () {

        const data = localStorage.getItem(Storage.KEY);

        if (!data) {
            alert("No data to export");
            return;
        }

        const fileName = "bullion_pro_backup.json";
        const jsonBlob = new Blob([data], { type: "application/json" });

        window.resolveLocalFileSystemURL(
            cordova.file.externalDataDirectory,
            function (dir) {

                 dir.getFile(fileName, { create: true }, function (file) {

                    file.createWriter(function (writer) {

                        writer.onwriteend = function () {
                            alert("Backup saved successfully");
                        };

                        writer.onerror = function (err) {
                            console.error(err);
                            alert("Export failed");
                        };

                        writer.write(jsonBlob);

                    });

                });

            },
            function (err) {
                console.error(err);
                alert("Storage access failed");
            }
        );

    }, { once: true });

}