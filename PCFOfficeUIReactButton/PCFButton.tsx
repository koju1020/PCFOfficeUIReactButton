import * as React from 'react';
import { DefaultButton, PrimaryButton, BaseButton, IButtonStyles} from 'office-ui-fabric-react';

export interface IPCFButtonProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
    buttonValue: string;
    buttonLabel: string;
    buttonBackgroundColour: string;
    buttonLabelColour: string;
    jobstatus: number;
    jobstatusValue: string;
    longitude?: number;
    latitude?: number;
    timestamp?: Date;
    isChecked?: boolean;
    isDisabled?: boolean;
    buttonClicker?: () => void;
}

export class ButtonAnchor extends React.Component<IPCFButtonProps> {

    private _buttonStyles: IButtonStyles;

    constructor(props: IPCFButtonProps) {
        super(props);

        this._buttonStyles = {
            root: {
                backgroundColor: this.props.buttonBackgroundColour,
                color: this.props.buttonLabelColour
            },
            rootDisabled: {
                backgroundColor: "#F3F2F1",
                color: "#A6A6A6"
            }
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <PrimaryButton styles={this._buttonStyles} disabled={this.props.isDisabled} onClick={this.props.buttonClicker} value={this.props.buttonValue} label={this.props.buttonLabel} target="_blank">
                    {this.props.buttonLabel}
                </PrimaryButton>
            </div>
        );
    }  
}