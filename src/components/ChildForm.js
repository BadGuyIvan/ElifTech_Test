import React, { Component, Fragment } from "react"
import { FormGroup, ControlLabel, FormControl, Button, ButtonToolbar} from "react-bootstrap";

const Api = (method,company) => {
    fetch('/child', 
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(company)
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

class ChildForm extends Component {

    state = {
        parentCompany: '',
        oldChildCompanyName:'',
        companyName: '',
        estimatedEarnings: 0
    }

    handleChange = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        })
    }

    clearState = () => {
        this.setState({
            parentCompany: '',
            companyName: '',
            estimatedEarnings: 0
        })
    }

    componentWillReceiveProps(nextProps) {
        // Any time props.company changes, update state.
        if (nextProps.company !== this.props.company && nextProps.isParent !== true) {
          this.setState({
            oldChildCompanyName: nextProps.company.companyName,
            companyName: nextProps.company.companyName,
            estimatedEarnings: nextProps.company.estimatedEarnings
          });
        } 
        if (nextProps.isParent === true) {
            this.setState({
                parentCompany:'',
                companyName: '',
                estimatedEarnings: 0
            })
        }
      }


    SubmitForm = (event) => {
        event.preventDefault();

        const company = {
            parent: this.state.parentCompany,
            companyName: this.state.companyName,
            estimatedEarnings: this.state.estimatedEarnings
        }

        if(this.state.parentCompany !== '')
        {
            Api('POST', company)
        }
        this.clearState();
        this.props.update();

    }

    UpdateChild = () => {
        const company = {
            oldChildCompanyName: this.state.oldChildCompanyName,
            companyName: this.state.companyName,
            estimatedEarnings: this.state.estimatedEarnings
        }

        if(this.state.companyName !== ''){
            Api("PUT", company);
        }
        this.clearState();
        this.props.update();
    }

    DeleteChild = () => {
        const company = {
            CompanyName: this.state.companyName
        }

        Api("DELETE", company);

        this.setState({
            companyName: '',
            estimatedEarnings: 0
        })

        this.props.update();
        
    }

    render(){
        const { isParent } = this.props;
        return (
            <form onSubmit={this.SubmitForm}>
                <FormGroup>
                    <ControlLabel>Parent Company Name</ControlLabel>
                    <FormControl
                        type="text"
                        name="parentCompany"
                        value={this.state.parentCompany}
                        placeholder="Enter Company Name"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Child Company Name</ControlLabel>
                    <FormControl
                        type="text"
                        name="companyName"
                        value={this.state.companyName}
                        placeholder="Enter Company Name"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Estimated Earnings Child Company</ControlLabel>
                    <FormControl
                        type="number"
                        name="estimatedEarnings"
                        value={this.state.estimatedEarnings}
                        placeholder="Enter Earn"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <ButtonToolbar>
                            <Button type="submit" bsStyle="primary" >Add Child to Company</Button>
                        {
                            !isParent && isParent !== null
                            ?
                                <Fragment>
                                    <Button bsStyle="primary" onClick={this.UpdateChild}>Edit</Button>
                                    <Button bsStyle="danger" onClick={this.DeleteChild}>Delete</Button>
                                </Fragment>
                            : null
                        }
                    </ButtonToolbar> 
            </form>
        )
    }
}

export default ChildForm;