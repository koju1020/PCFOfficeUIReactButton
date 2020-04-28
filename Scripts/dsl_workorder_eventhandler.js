var formContext = null;
var execContext = null;
var isSprayJob = true;

var datacomFormContext = {};

const JobStatus = {
    NotStarted: 609810000,
    SiteEntered: 609810001,
    StartedJob: 609810002,
    FinishedJob: 609810003,
    LeftSite: 609810004
}

function onLoad(executionContext) {
    execContext = executionContext;
    formContext = executionContext.getFormContext();
    setEvents();
    isSprayJob = isSprayDairyJon();
    showHideOperatorDetails();
}

function setEvents() {
    var jobStatusAttribute = formContext.getAttribute("dsl_job_status_option_set");
    if (typeof (jobStatusAttribute) != "undefined" && jobStatusAttribute != null) {
        jobStatusAttribute.addOnChange(jobStatusOnChange);
    }
}

function jobStatusOnChange() {
    showHideOperatorDetails();
}

function showHideOperatorDetails() {
    var jobStatusValue = datacomFormContext.getFieldValue(execContext, "dsl_job_status_option_set");

    if (isSprayJob) {
        if (jobStatusValue !== null && jobStatusValue != "undefined") {
            switch (jobStatusValue) {
                case JobStatus.NotStarted:
                    datacomFormContext.showHideField(execContext, "dsl_windcode", false);
                    datacomFormContext.showHideField(execContext, "dsl_windspeedkph", false);
                    datacomFormContext.showHideField(execContext, "dsl_weathercode", false);
                    datacomFormContext.showHideField(execContext, "dsl_temperature", false);
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", false);
                    //datacomFormContext.showHideField(execContext, "dsl_onsitetime", false);
                    //datacomFormContext.showHideField(execContext, "dsl_jobstarttime", false);
                    //datacomFormContext.showHideField(execContext, "dsl_jobcompletetime", false);
                    //datacomFormContext.showHideField(execContext, "dsl_leftsitetime", false);
                    break;
                case JobStatus.SiteEntered:
                    datacomFormContext.showHideField(execContext, "dsl_windcode", true);
                    datacomFormContext.showHideField(execContext, "dsl_windspeedkph", true);
                    datacomFormContext.showHideField(execContext, "dsl_weathercode", true);
                    datacomFormContext.showHideField(execContext, "dsl_temperature", true);
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", true);
                    break;
                case JobStatus.StartedJob:
                    datacomFormContext.showHideField(execContext, "dsl_windcode", true);
                    datacomFormContext.showHideField(execContext, "dsl_windspeedkph", true);
                    datacomFormContext.showHideField(execContext, "dsl_weathercode", true);
                    datacomFormContext.showHideField(execContext, "dsl_temperature", true);
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", true);
                    break;
                case JobStatus.FinishedJob:
                    datacomFormContext.showHideField(execContext, "dsl_windcode", true);
                    datacomFormContext.showHideField(execContext, "dsl_windspeedkph", true);
                    datacomFormContext.showHideField(execContext, "dsl_weathercode", true);
                    datacomFormContext.showHideField(execContext, "dsl_temperature", true);
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", true);
                    break;
                case JobStatus.LeftSite:
                    datacomFormContext.showHideField(execContext, "dsl_windcode", true);
                    datacomFormContext.showHideField(execContext, "dsl_windspeedkph", true);
                    datacomFormContext.showHideField(execContext, "dsl_weathercode", true);
                    datacomFormContext.showHideField(execContext, "dsl_temperature", true);
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", true);
                    break;
                default:
                    datacomFormContext.showHideField(execContext, "dsl_windcode", false);
                    datacomFormContext.showHideField(execContext, "dsl_windspeedkph", false);
                    datacomFormContext.showHideField(execContext, "dsl_weathercode", false);
                    datacomFormContext.showHideField(execContext, "dsl_temperature", false);
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", false);
                    break;
            }
        }
        else {
            datacomFormContext.showHideField(execContext, "dsl_windcode", false);
            datacomFormContext.showHideField(execContext, "dsl_windspeedkph", false);
            datacomFormContext.showHideField(execContext, "dsl_weathercode", false);
            datacomFormContext.showHideField(execContext, "dsl_temperature", false);
            datacomFormContext.showHideField(execContext, "dsl_operatornotes", false);
        }
    }
    else {
        if (jobStatusValue !== null && jobStatusValue != "undefined") {
            datacomFormContext.showHideField(execContext, "dsl_windspeedkph", false);
            datacomFormContext.showHideField(execContext, "dsl_weathercode", false);
            datacomFormContext.showHideField(execContext, "dsl_temperature", false);
            datacomFormContext.showHideField(execContext, "dsl_windcode", false);

            switch (jobStatusValue) {
                case JobStatus.NotStarted:
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", false);
                    break;
                case JobStatus.SiteEntered:
                case JobStatus.StartedJob:
                case JobStatus.FinishedJob:
                case JobStatus.LeftSite:
                    datacomFormContext.showHideField(execContext, "dsl_operatornotes", true);
                    break;
            }

        }
        else {
            datacomFormContext.showHideField(execContext, "dsl_windcode", false);
            datacomFormContext.showHideField(execContext, "dsl_windspeedkph", false);
            datacomFormContext.showHideField(execContext, "dsl_weathercode", false);
            datacomFormContext.showHideField(execContext, "dsl_temperature", false);
            datacomFormContext.showHideField(execContext, "dsl_operatornotes", false);
        }
    }

}

function isSprayDairyJon() {
    var primaryIncidentType = datacomFormContext.getFieldValue(execContext, "msdyn_primaryincidenttype");

    if (primaryIncidentType != "undefined" && primaryIncidentType != null) {
        if (primaryIncidentType.name.includes('Spray') || primaryIncidentType.name.includes('Spray Job')) { return true; }
        else { return false; }
    }
    else { return false;}


}

datacomFormContext.getFieldValue = function (executionContext, fieldName) {
    var formContext = executionContext.getFormContext();
    var field = formContext.getAttribute(fieldName);
    if (field !== null) {
        if (typeOf(field.getValue()) === "array") {
            if (field.getValue() !== null) {
                return field.getValue()[0];
            } else {
                return null;
            }
        } else {
            return field.getValue();
        }
    } else {
        return null;
    }
};

// Show/Hide field on form
// Parameter - fieldName (String): the field name - e.g. "dsl_addressline4"
// Parameter - showField (Boolean): whether to show the field or not - "true" to show field, "false" to hide field
datacomFormContext.showHideField = function (executionContext, fieldName, showField) {
    var formContext = executionContext.getFormContext();
    var control = formContext.getControl(fieldName); // shortcut to formContext.ui.controls.get
    //var control = formContext.getAttribute(fieldName);
    if (control) {
        control.setVisible(showField);
    }
};

// Check the type of an object - useful for validatation
function typeOf(o) {
    var type = typeof o;
    //If typeof return something different than object then returns it.
    if (type !== 'object') {
        return type;
        //If it is an instance of the Array then return "array"
    } else if (Object.prototype.toString.call(o) === '[object Array]') {
        return 'array';
        //If it is null then return "null"
    } else if (Object.prototype.toString.call(o) === '[object Date]') {
        return 'date';
    } else if (o === null) {
        return 'null';
        //if it gets here then it is an "object"
    } else {
        return 'object';
    }
}