sap.ui.getCore().attachInit(function () {
    new sap.m.Shell({
        app: new sap.ui.core.ComponentContainer({
            name: "sap.ui.pedro.crud",
            height: "100%"
        })
    }).placeAt("content")

    console.log("Tracking: SAPUI5 started...");
});