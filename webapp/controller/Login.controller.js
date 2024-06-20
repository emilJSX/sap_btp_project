sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History" 
], function (Controller, JSONModel, MessageBox, UIComponent, History) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Login", {
        onInit: function () {
            var oModel = new JSONModel({
                username: "",
                password: ""
            });
            this.getView().setModel(oModel, "login");
        },

        onLoginPress: function () {
            var oModel = this.getView().getModel("login");
            var sUsername = oModel.getProperty("/username");
            var sPassword = oModel.getProperty("/password");

            $.ajax({
                url: "http://127.0.0.1:8000/login",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    username: sUsername,
                    password: sPassword
                }),
                success: function (response) {
                    if (response.success) {
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("homepage");
                    } else {
                        MessageBox.error("Error: " + response.message);
                    }
                }.bind(this),
                error: function () {
                    MessageBox.error("Login Server Error");
                }
            });
        }
    });
});
