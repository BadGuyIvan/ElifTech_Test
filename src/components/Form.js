import React, { Component, Fragment } from "react"
import { FormGroup, ControlLabel, FormControl, Button, ButtonToolbar} from "react-bootstrap";

const Api = (method,company) => {
    fetch('/company', 
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

class Form extends Component {

    state = {
        oldCompanyName:'',
        companyName: '',
        estimatedEarnings: 0
    }

    onChange =(e) => {  
        const newText = e.target.value;  
        this.setState({companyName : newText});  
    }  

    handleChange = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        })
    }

    componentWillReceiveProps(nextProps) {
        // Any time props.company changes, update state.
        if (nextProps.company !== this.props.company && nextProps.isParent !== false) {
          this.setState({
            oldCompanyName: nextProps.company.companyName,
            companyName: nextProps.company.companyName,
            estimatedEarnings: nextProps.company.estimatedEarnings
          });
        }
        if(nextProps.isParent === false) {
            this.setState({
                companyName: '',
                estimatedEarnings: 0
            })
        }
      }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     if(nextProps.company === prevState.editCompany || nextProps.isParent === false) {
    //         return null
    //     }
    //     return { 
    //         companyName: nextProps.company.companyName, 
    //         estimatedEarnings: nextProps.company.estimatedEarnings
    //     };
    // }

    SubmitForm = (event) => {
        event.preventDefault();

        const company = {
            companyName: this.state.companyName,
            estimatedEarnings: this.state.estimatedEarnings
        }

        Api("POST",company);
        
        this.setState({
            companyName: '',
            estimatedEarnings: 0
        })

        this.props.update();
    }

    FormUpdate = () => {
        const company = {
            oldCompanyName: this.state.oldCompanyName,
            companyName: this.state.companyName,
            estimatedEarnings: this.state.estimatedEarnings
        }
        
        Api("PUT",company)

        this.setState({
            companyName: '',
            estimatedEarnings: 0
        })

        this.props.update();

    }

    FormDelete = () => {
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
        const { isParent, company } = this.props;
        const { editCompany } = this.state;
        return (
            <form onSubmit={this.SubmitForm}>
                <FormGroup>
                    <ControlLabel>Company Name</ControlLabel>
                    <FormControl
                        type="text"
                        name="companyName"
                        value={this.state.companyName}
                        placeholder="Enter Company Name"
                        onChange={this.onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Earn Company</ControlLabel>
                    <FormControl
                        type="number"
                        name="estimatedEarnings"
                        value={this.state.estimatedEarnings}
                        placeholder="Enter Earn"
                        onChange={this.handleChange}
                    />
                </FormGroup> 
                    <ButtonToolbar>
                            <Button type="submit" bsStyle="primary" >Add Company</Button>
                        {
                            isParent 
                            ?
                                <Fragment>
                                    <Button bsStyle="primary" onClick={this.FormUpdate}>Edit</Button>
                                    <Button bsStyle="danger" onClick={this.FormDelete}>Delete</Button>
                                </Fragment>
                            : null
                        }
                    </ButtonToolbar> 
            </form>
        )
    }
}

export default Form;