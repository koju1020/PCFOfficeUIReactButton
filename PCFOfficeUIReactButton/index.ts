import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ButtonAnchor, IPCFButtonProps } from './PCFButton';
import { error } from "util";
import { runInThisContext } from "vm";
import { number } from "prop-types";

export class PCFOfficeUIReactButton implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private theContainer: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
	private props: IPCFButtonProps = {
		buttonValue: "",
        buttonLabel: "",
        buttonBackgroundColour: "blue",
        buttonLabelColour: "white",
        jobstatus: 0,
        jobstatusValue: "",
        isChecked: false,
        isDisabled: true,
        buttonClicker: this.buttonClicker.bind(this)
    }

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		// Add control initialization code
		
		this.theContainer = container;
        this.notifyOutputChanged = notifyOutputChanged;
        this._context = context;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
        this.props.buttonValue = context.parameters.buttonValue.raw!;
        this.props.buttonLabel = context.parameters.buttonLabel.raw!;
        if (context.parameters.buttonBackgroundColour.raw != null) this.props.buttonBackgroundColour = context.parameters.buttonBackgroundColour.raw!;
        if (context.parameters.buttonLabelColour.raw != null) this.props.buttonLabelColour = context.parameters.buttonLabelColour.raw!; 
        this.props.jobstatus = context.parameters.jobStatus.raw!;
        this.props.jobstatusValue = context.parameters.jobStatus.formatted!;
        this.props.isChecked = this.isChecked(this._context.parameters.jobstatusMapping.raw!);
        this.props.isDisabled = this.isDisabled(this._context.parameters.jobstatusMapping.raw!);
		ReactDOM.render(
			React.createElement(
				ButtonAnchor,
				this.props
			),
			this.theContainer
		);
    }

    /**
 * Called by the React component when it detects a change in the number of faces shown
 * @param newValue The newly detected number of faces
 */
    private buttonClicker() {

        if (this._context.client.getClient() != 'Mobile') {
            console.log(this._context.client.getClient());
            this._context.navigation.openAlertDialog({ text: "This function is only available on mobile. Please set coordinates & timestamp manually", confirmButtonLabel: "Yes" });
            return;
        }
        else {

            this._context.device.getCurrentPosition().then(
                (loc) => {
                    this.props.latitude = loc.coords.latitude;
                    this.props.longitude = loc.coords.longitude;
                    this.props.timestamp = new Date();

                    this.SetNextStatus();
                    this.notifyOutputChanged();
                },
                (error) => {
                    this._context.navigation.openErrorDialog({ message: "Please verify if you allowed the Dynamics 365 App to access your location. You can review in 'Settings' > 'Mobile Settings' > 'User Content and Location' enanbled", errorCode: 500, details: error });
                }
            );
        }
    }

    private SetNextStatus() {
        switch (this.props.jobstatus) {
            case JobStatus.NotStarted:
                this.props.jobstatus = JobStatus.SiteEntered;
                break;
            case JobStatus.SiteEntered:
                this.props.jobstatus = JobStatus.StartedJob;
                break;
            case JobStatus.StartedJob:
                this.props.jobstatus = JobStatus.FinishedJob;
                break;
            case JobStatus.FinishedJob:
                this.props.jobstatus = JobStatus.LeftSite;
                break;
            case JobStatus.LeftSite:
                break;
            default:
                break;
        }
        this.notifyOutputChanged();
    }

    private isChecked(statusMapping: number) {
        if (statusMapping <= this.props.jobstatus) return true;
        else return false;
    }

    private isDisabled(statusMapping: number) {

        if (statusMapping == (this.props.jobstatus + 1) || (this.props.jobstatus == 0 && statusMapping == JobStatus.SiteEntered)) return false;
        else return true;
    }

    private getCurrentLocation(): Location {

        let loc = new Location();
        this._context.device.getCurrentPosition().then(

            function (location) {
                loc.latitude = location.coords.latitude;
                loc.longitude = location.coords.longitude;
                loc.timestamp = location.timestamp;

                return loc;
            }, function (error) {
                throw error;
            }
        );
        return loc;
    }

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
    public getOutputs(): IOutputs {
        let result: IOutputs = {
            buttonValue: this.props.buttonValue,
            jobStatus: this.props.jobstatus,
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            timestamp: this.props.timestamp
        };
        return result;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this.theContainer);
	}
}

const JobStatus = {
    NotStarted: 609810000,
    SiteEntered: 609810001,
    StartedJob: 609810002,
    FinishedJob: 609810003,
    LeftSite: 609810004
}

class Location
{
    public longitude?: number;
    public latitude?: number;
    public timestamp?: Date;

    constructor() { }
}

interface ILocation {
    longitude?: number;
    latitude?: number;
    timestamp?: Date;
}