"use strict";

sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    return Controller.extend("sap.ui.pedro.crud.controller.App", {
        onPress: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("main");
        }
    });
});
