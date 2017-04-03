@import 'lib/file-utils.js';
@import 'lib/mainThread-utils.js';

var showSettings = function(context) {

  // Load up the settings file
  var scriptPath = context.scriptPath;
  var scriptFolder = [scriptPath stringByDeletingLastPathComponent];
  var settingsFile = jsonFromFile(scriptFolder + '/lib/settings.js', true);

  // Create an accessory view to hold all of our controls
  var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, 0.0, 260.0, 100.0))

  // Create a label for the max restore field
  var maxRestoreLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0.0, 67.5, 260.0, 20.0))
  maxRestoreLabel.setEditable(false);
  maxRestoreLabel.setBordered(false);
  maxRestoreLabel.setDrawsBackground(false);
  maxRestoreLabel.setStringValue("Max number of selections to restore:");
  accessoryView.addSubview(maxRestoreLabel);

  // Create a max restore field that captures how many selections the user
  // wants to store
  var maxRestoreField = NSTextField.alloc().initWithFrame(NSMakeRect(235.0, 70.0, 20.0, 20.0))
  maxRestoreField.cell().setStringValue(settingsFile.maxRestoreCount);
  accessoryView.addSubview(maxRestoreField);

  // Create a label for the check for updates control
  var checkForUpdatesLabel = NSTextField.alloc().initWithFrame(NSMakeRect(2.5, 20.0, 260.0, 20.0))
  checkForUpdatesLabel.setEditable(false);
  checkForUpdatesLabel.setBordered(false);
  checkForUpdatesLabel.setDrawsBackground(false);
  checkForUpdatesLabel.setStringValue("Auto check for updates?");
  accessoryView.addSubview(checkForUpdatesLabel);

  // Create a check for updates segmented control where the user can select
  // whether they want to auto check for updates
  var checkForUpdates = NSSegmentedControl.alloc().initWithFrame(NSMakeRect(175.0, 17.5, 100.0, 20.0))
  checkForUpdates.segmentCount = 2;
  checkForUpdates.setLabel_forSegment("No", 0);
  checkForUpdates.setLabel_forSegment("Yes", 1);
  checkForUpdates.setSelected_forSegment(true, settingsFile.checkForUpdates);
  accessoryView.addSubview(checkForUpdates);

  // Create the alert and attach the accessory view
  var alert = NSAlert.alloc().init();
  var icon = NSImage.alloc().initByReferencingFile(scriptFolder + '/lib/icons/reselect.icns');
  alert.setIcon(icon);
  alert.addButtonWithTitle("Save");
  alert.addButtonWithTitle("Cancel");
  alert.setAccessoryView(accessoryView);
  alert.setMessageText("Reselect Settings");

  // Run the modal and capture the values
  alert.runModal();

  var settingsObject = {
      maxRestoreCount: maxRestoreField.stringValue(),
      checkForUpdates: checkForUpdates.isSelectedForSegment(1)
  }

  // Save the new values to the settings file
  saveJsonToFile(settingsObject, scriptFolder + '/lib/settings.js');

  // Save the values to the main thread as well
  saveToThreadDict(kReselectMaxRestoreCount, maxRestoreField.stringValue());
  saveToThreadDict(kReselectCheckForUpdates, checkForUpdates.isSelectedForSegment(1));
};