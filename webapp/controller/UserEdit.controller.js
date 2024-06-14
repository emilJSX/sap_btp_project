sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
], function (Controller, JSONModel, MessageToason) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.UserUpdate", {
        onInit: function () {
            var oRoleModel = new JSONModel({
                roles: [
                    { key: "Admin", text: "Admin" },
                    { key: "Redactor", text: "Redactor" },
                    { key: "Moderator", text: "Moderator" },
                    { key: "Guest", text: "Guest" }
                ]
            });
            this.getView().setModel(oRoleModel, "roles");
            this.getRouter().getRoute("editUser").attachPatternMatched(this._onObjectMatched, this);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onGoHome: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("homepage");
        },

        onDeleteUser: function (userId) {
            var oModel = this.getView().getModel("user");
            var sUserId = oModel.getProperty("/id");

            jQuery.ajax({
                url: "http://localhost:3000/api/users/" + sUserId,
                method: "DELETE",
                success: function (response) {
                    sap.m.MessageToast.show("User deleted successfully!");
                    window.location.href="index.html#/homepage"
                },
                error: function (xhr, status, error) {
                    MessageBox.error("Failed to delete user: " + error);
                }
            });
        },

        _onObjectMatched: function (oEvent) {
            const userId = oEvent.getParameter("arguments").userId;
            this._loadUserData(userId);
        },

        onSaveChanges: function () {
            var oModel = this.getView().getModel("user");
            var oData = oModel.getData();

            var userData = {
                username: oData.username,
                email: oData.email,
                password: oData.password,
                role: oData.role,
                position: oData.position,
                education: oData.education,
                contactInfo: oData.contactInfo
            };

            jQuery.ajax({
                url: "http://localhost:3000/api/users/" + oData.id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(userData),
                success: function (response) {
                    sap.m.MessageToast.show("User updated successfully!");
                },
                error: function (xhr, status, error) {
                    sap.m.MessageBox.error("Failed to update user: " + error);
                }
            });
        },

        _loadUserData: function (userId) {
            const oViewModel = new JSONModel();
            this.getView().setModel(oViewModel, "user");
            jQuery.ajax({
                type: "GET",
                url: "http://localhost:3000/api/users/" + userId,
                success: function (data) {
                    oViewModel.setData(data);
                },
                error: function () {
                    console.log("Failed to fetch user data.");
                }
            });
        }
    });
});
