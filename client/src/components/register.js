import React from "react";
import './register.css';
import { NavLink, withRouter } from "react-router-dom";

const goodStyle = {
    color: 'green'
}
const badStyle = {
    color: 'red'
}

const API = 'http://localhost:4005/users';


class InputRow extends React.Component{
    constructor(props){
        super(props);
        this.ref = this.props.ref;
        this.handle = this.handle.bind(this);
    }
    handle(e) {
        this.props.handleChange(e, this.props.rfr);
    }
    render() {
        return(
            <div>
                <div className="form-row">
                    <div className='col-12 form-row'>
                        <label className='col-md-6'>Please enter your { this.props.label }</label>
                        <p className='col-md-6 text-right' style={this.props.style}>{ this.props.status }</p>
                    </div>
                    <input name={ this.props.label } onChange={ this.handle } className="form-control inputField" type={ this.props.type} placeholder={ this.props.label }></input>
                </div>
            </div>
        )
    }
}

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userInput: {
                userName: "",
                email: "",
                password: "",
                confirm: ""
            },
            status: {
                userName: "",
                email: "",
                password: "",
                confirm: ""
            },
            style: {
                userName: badStyle,
                email: badStyle,
                passwword: badStyle,
                confirm: badStyle
            },
            errors: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.submit = this.submit.bind(this);
    }

    // vConfirm = verify confirm password field. Checks to see if the pass/confirm pass match then sends information to 'handle update'
    vConfirm(newVal){
        let message = '';
        let currPass = this.state.userInput.password;
        if(currPass.length > 1){
            if(currPass !== newVal){
                message = 'Passwords must match';
            } else{
                message = 'good';
            }
        }
        this.handleUpdate('confirm', message, newVal);
    }

    // vPassword = verify password field. Checks conditions listed in requirements then sends information to 'handle update'
    vPassword(newVal){
        let length = newVal.length;
        let message = '';
        if(length < 8){
            message = 'Password must be at least 8 characters';
        } else if(length > 20){
            message = 'Password must be less than 20 characters';
        } else {
            message = 'good';
        }
        this.handleUpdate('password', message, newVal);
    }

    // vEmail = verify email field. Checks conditions listed in requirements, then hands off to is unique to handle checking db in realtime
    // If the basic validations fail, this function simply sends to handleUpdate function to update the validated error
    vEmail(newVal){
        let length = newVal.length;
        let message = '';
        if(length > 50){
            message = 'Email must be less than 50 characters in length';
        } else if(!(/[^@]+@[^@]+\.[^@]/.test(newVal))){
            message = 'Invalid email format';
        } else if(length >= 5){
            let data = {"email": newVal};
            fetch(API + '/checkUnique', {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(data)})
                .then((res)=>(res.json()))
                .then(data => this.isUnique(data, newVal))
                .catch(err => console.log(err));
            return;
        }
        this.handleUpdate('email', message, newVal);
    }

    // vUserName = verify userName field. Checks conditions listed in requirements then sends information to 'handle update'
    vUserName(newVal){
        let length = newVal.length;
        let message = '';
        if((length < 4) && (length >= 0)){
            message = 'Username must be at least 4 characters';
        } else if(length > 20){
            message = 'Username must be at most 20 characters';
        } else {
            for(let i=0; i<length; i++){
                let c = newVal.charCodeAt(i);
                if((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122)){
                    continue;
                } else {
                    message = 'Username must be alphanumeric';
                    break;
                }
            }
            if(message !== 'Username must be alphanumeric'){
                message = 'good';
            }
        }
        this.handleUpdate('userName', message, newVal);
    }

    // In keeping with DRY principles; this function replicates the three substates listed in the constructor,
    // updates them and then saves state. Keeps input up to date for later submission in addition to front end messages in the DOM
    handleUpdate(field, message, newVal){
        const myInput = this.state.userInput;
        const myStatus = this.state.status;
        const myStyle = this.state.style;
        myInput[field] = newVal;
        myStatus[field] = message;
        if(message === 'good'){
            myStyle[field] = goodStyle;
        } else {
            myStyle[field] = badStyle;
        }
        this.setState({
            userInput: myInput,
            status: myStatus,
            style: myStyle,
        })
        return;
    }

    // Listens for change to one of the input fields, routes to the correct function
    handleChange(e, field) {
        let newVal = e.target.value;
        if(field === 'userName'){
            this.vUserName(newVal);
        } else if(field === 'email'){
            this.vEmail(newVal);
        } else if(field === 'password'){
            this.vPassword(newVal);
        } else{
            this.vConfirm(newVal);
        }
    }

    // checks to see if the user-inputted email is already in use, if so it adjusts the message and routes to update handler function
    isUnique(result, fieldVal){
        let message = 'This email is already in use';
        if(result === true){
            message = 'good';
        }
        this.handleUpdate('email', message, fieldVal);
    }

    // Takes data returned from submission, if the insertId is undefined then the result must be an error message (so it updates errors),
    // else it saves the returned ID and username to localstorage and redirects to the dashboard
    onSetResult(result) {
        if(result.insertId === undefined){
            this.setState({errors: result});
        } else {
            let state = {};
            state.userId = result.insertId;
            state.userName = this.state.userInput.userName;
            localStorage.setItem('session', JSON.stringify(state));
            this.props.history.push('/dashboard');
        }
        return;
    }

    // Listens for form submission. Prevents default reload.
    // Checks every front-end validation message to see if they are 'good', then moves on.
    // If they are all 'good' submits data to NODE/Express, sends returned data to onSetResult function
    submit(e){
        e.preventDefault();
        let valid = true;
        for(let key in this.state.status){
            if(this.state.status[key] !== 'good'){
                valid = false;
            }
        }
        if(valid === false){
            this.setState({errors: ['Please correct issues with registration form']});
        } else {
            let data = {
                "userName": this.state.userInput.userName,
                "email": this.state.userInput.email,
                "password": this.state.userInput.password,
            };
            fetch(API, {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(data)})
                .then((res)=>(res.json()))
                .then(data => this.onSetResult(data))
                .catch(err => console.log(err));
        }
    }
    render(){
        let errors = this.state.errors.map((error) => {
            return (
                <li>{error}</li>
            );
        });
        return (
            <div className='outerDiv'>
                <div className="spacer"></div>
                <NavLink className="col-md-5 text-center linky offset-md-4" to="/login">Already have an account?</NavLink>
                <div>
                    <form onSubmit={ this.submit } className="form-group d-inline-block col-md-5 p-4 mt-5 offset-md-2">
                        <InputRow handleChange={ this.handleChange } type='text' style={this.state.style.userName} status={this.state.status.userName} label="Username" rfr='userName' />
                        <InputRow handleChange={ this.handleChange } type='text' style={this.state.style.email} status={this.state.status.email} label="Email" rfr='email' />
                        <InputRow handleChange={ this.handleChange } type='password' style={this.state.style.password} status={this.state.status.password} label="Password" rfr='password' />
                        <InputRow handleChange={ this.handleChange } type='password' style={this.state.style.confirm} status={this.state.status.confirm} label="Pass-Confirm" rfr='confirm' />
                        <button type='submit' value='submit' className='btn btn-primary btn-lg mt-3 mb-3 offset-md-5'>Register</button>
                    </form>
                    <div className='col-md-3 offset-md-1 w-100 spacer align-top d-inline-block mt-5'>
                        <h4 className='text-center mb-3 border-bottom border-danger p-3 text-danger'>Errors</h4>
                        <ul>{errors}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);