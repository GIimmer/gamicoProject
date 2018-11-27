import React from "react";
import './register.css';
import { NavLink, withRouter } from "react-router-dom";


// These styles correspond to front end validations (this.vEmail, this.vPassword)
const goodStyle = {
    color: 'green'
}
const badStyle = {
    color: 'red'
}

const API = 'http://localhost:4005/users/login';

// Child component of main login component
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

// This is the main/parent class. 
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userInput: {
                email: "",
                password: ""
            },
            status: {
                email: "",
                password: "",
            },
            style: {
                email: badStyle,
                password: badStyle,
            },
            errors: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.submit = this.submit.bind(this);
    }
    // vPassword = verify password field. Checks conditions listed in requirements then sends information to 'handle update'
    vPassword(newVal){
        let length = newVal.length;
        let message = '';
        if(length < 8){
            message = 'Password form requires 8 characters';
        } else if(length > 20){
            message = 'Password form requires less than 20 characters';
        } else {
            message = 'good';
        }
        this.handleUpdate('password', message, newVal);
    }

    // vEmail = verify email field. Checks conditions listed in requirements then sends information to 'handle update'
    vEmail(newVal){
        let length = newVal.length;
        let message = '';
        if(length > 50){
            message = 'Email form requires less than 50 characters';
        } else if(!(/[^@]+@[^@]+\.[^@]/.test(newVal))){
            message = 'Invalid email format';
        } else if(length > 5){
            message = "good";
        }
        this.handleUpdate('email', message, newVal);
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
        if(field === 'email'){
            this.vEmail(newVal);
        } else {
            this.vPassword(newVal);
        }
    }

    // Takes data returned from submission, if the username is undefined then the result must be an error message (so it updates errors),
    // else it saves the returned ID and username to localstorage and redirects to the dashboard
    onSetResult(result){
        if(result.username === undefined){
            this.setState({errors: result});
        } else {
            let state = {};
            state.userName = result.username;
            state.userId = result.usersId;
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
            this.setState({errors: ['Please correct issues with login form']});
        } else {
            this.setState({errors: []});
            let data = {
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
        const errors = this.state.errors.map((error) =>
              <li>{error}</li>
        );
        return (
            <div className='outerDiv'>
                <div className="spacer"></div>
                <NavLink className="col-md-5 text-center linky offset-md-4" to="/">Don't have an account?</NavLink>
                <div>
                    <form onSubmit={ this.submit } className="form-group d-inline-block col-md-5 p-4 mt-5 offset-md-2">                        
                        <InputRow handleChange={ this.handleChange } type='text' style={this.state.style.email} status={this.state.status.email} label="Email" rfr='email' />
                        <InputRow handleChange={ this.handleChange } type='password' style={this.state.style.password} status={this.state.status.password} label="Password" rfr='password' />
                        <button type='submit' value='submit' className='btn btn-primary btn-lg mt-3 mb-3 offset-md-5'>Login</button>
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

export default withRouter(Login);