sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.UserCreation", {
        onInit: function () {
            var oModel = new JSONModel({
                username: "",
                email: "",
                password: "",
                role: "",
                position: "",
                education: "",
                contactInfo: ""
            });
            this.getView().setModel(oModel, "user");

            var oRoleModel = new JSONModel({
                roles: [
                    { key: "Admin", text: "Admin" },
                    { key: "Redactor", text: "Redactor" },
                    { key: "Moderator", text: "Moderator" },
                    { key: "Guest", text: "Guest" }
                ]
            });
            this.getView().setModel(oRoleModel, "roles");
        },

        onPressBackBtn: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("homepage");
            this._loadListData();
        },

        _loadListData: function () {
            var oListModel = this.getView().getModel("user");
            oListModel.loadData("http://localhost:3000/api/users");
        },

        onCreateUser: function () {
            var oModel = this.getView().getModel("user");
            var oData = oModel.getData();

            if (!oData.username || !oData.email || !oData.password || !oData.role) {
                MessageBox.error("Please fill all required fields (Username, Email, Password, Role).");
                return;
            }

            $.ajax({
                url: "http://localhost:3000/api/users",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oData),
                success: function (response) {
                    MessageToast.show("User created successfully!");
                    oModel.setData({
                        username: "",
                        email: "",
                        password: "",
                        role: "",
                        position: "",
                        education: "",
                        contactInfo: ""
                    });
                },
                error: function () {
                    MessageBox.error("Failed to create user.");
                }
            });
        }
    });
});
