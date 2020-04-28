var formContext = null;
var execContext = null;

function TimeStampButton(executionContext)
{
    var clientContext = Xrm.Utility.getGlobalContext().client;
    var client = clientContext.getClient();
    console.log(client);

    if (client == 'Mobile') {
        execContext = executionContext;
        formContext = executionContext.getFormContext();

        Xrm.Device.getCurrentPosition().then(
            function success(location) {
                Xrm.Navigation.openAlertDialog({
                    text: "Latitude: " + location.coords.latitude +
                        ", Longitude: " + location.coords.longitude
                });
            },
            function (error) {
                Xrm.Navigation.openAlertDialog({ text: error.message });
            }
        ); 
    }
}