import React, { Component } from "react";
import { Grid, Col, Row } from "react-bootstrap";
import Form from "./Form";
import ChildForm from "./ChildForm";
import Tree from './Tree';
import "./styles/Home.scss";

class Home extends Component {

    state = {
        companies: [],
        parent: '',
        isParent: null,
        edit : {
            companyName:'',
            estimatedEarnings: 0
        }
    }

    componentDidMount(){          
        this.UpdateList()
    }

    UpdateList = () => {
        fetch('/companies',  { method: 'GET'})
            .then(response => response.json())
            .then(data => this.setState({companies: data}))   
    }

    onChange = (event) => {
        this.setState({parent: event.target.value});
    }

    FindContent = (event) => {
        event.stopPropagation();
        const companyName = event.target.innerHTML.match(/([a-zA-Z0-9 _-])*(?=\<)/)[0].trim();
        const digit = event.target.innerHTML.match(/(?<=\<span\>)(\d*)(?=\<\/span\>)/)[0];
        
        const find_parent = this.state.companies.find(company => company.companyName === companyName);

        const _company = { companyName, estimatedEarnings: digit };

        this.setState({ isParent: !!find_parent, edit: _company});
    }
    
    render(){
        const { isParent, edit } = this.state;
        return(
            <Grid>
                <Row>
                    <Col lg={8}>
                        <div className="Tree" onClick={this.FindContent}>
                            <Tree data={this.state.companies} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <Form update={this.UpdateList} isParent={isParent} company={edit}/>
                        <hr/>
                        <div className="child-form">
                            { 
                                this.state.companies.length === 0 
                                    ? null 
                                    : <ChildForm update={this.UpdateList} isParent={isParent} company={edit}/>
                            }
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default Home;