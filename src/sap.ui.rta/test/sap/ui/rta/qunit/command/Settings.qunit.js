/* global QUnit */

QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/rta/command/CommandFactory",
	"sap/ui/rta/command/BaseCommand",
	"sap/ui/fl/registry/ChangeRegistry",
	"sap/ui/fl/changeHandler/PropertyChange",
	"sap/ui/fl/Utils",
	"sap/ui/thirdparty/sinon-4"
],
function(
	CommandFactory,
	BaseCommand,
	ChangeRegistry,
	PropertyChange,
	FlUtils,
	sinon
) {
	"use strict";

	var sandbox = sinon.sandbox.create();
	var oCommandFactory = new CommandFactory();
	var oMockedAppComponent = {
		getLocalId: function () {
			return undefined;
		},
		getManifestEntry: function () {
			return {};
		},
		getMetadata: function () {
			return {
				getName: function () {
					return "someName";
				}
			};
		},
		getManifest: function () {
			return {
				"sap.app" : {
					applicationVersion : {
						version : "1.2.3"
					}
				}
			};
		},
		getModel: function () {}
	};

	QUnit.module("Given a settings change with a valid entry in the change registry,", {
		beforeEach : function(assert) {
			var oChangeRegistry = ChangeRegistry.getInstance();
			oChangeRegistry.registerControlsForChanges({
				"sap.m.Button" : {
					"changeSettings" : "sap/ui/fl/changeHandler/PropertyChange"
				}
			});

			sandbox.stub(FlUtils, "getAppComponentForControl").returns(oMockedAppComponent);
			sandbox.stub(PropertyChange, "completeChangeContent");

			this.oSettingsChange = {
				selectorControl : {
					id : "button",
					controlType : "sap.m.Button",
					appComponent : oMockedAppComponent
				},
				changeSpecificData : {
					changeType : "changeSettings",
					content : "testchange"
				}
			};
		},
		afterEach : function() {
			sandbox.restore();
		}
	});

	QUnit.test("when getting a settings command for the change ...", function(assert) {
		return oCommandFactory.getCommandFor(this.oSettingsChange.selectorControl, "settings", this.oSettingsChange.changeSpecificData)

		.then(function(oCommand) {
			assert.ok(oCommand instanceof BaseCommand, "the settings command exists");
		})

		.catch(function (oError) {
			assert.ok(false, 'catch must never be called - Error: ' + oError);
		});
	});

	QUnit.start();
});