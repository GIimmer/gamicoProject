import React from 'react';
import { withRouter } from "react-router-dom";


class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userName: "",
            userId: null,
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    // State should have information, if not the user is likely trying to directly type 'dashboard' into the URL
    // This sparks a re-route to the register page
    componentDidMount(){
        let state = JSON.parse(localStorage.getItem('session'));
        if(state == null){
            this.props.history.push('/');
        } else {
            this.setState({userName: state.userName, userId: state.userId});
        }
    }

    // Clears local storage and re-routes to login page (requirements + logical action)
    handleLogout(){
        localStorage.clear();
        this.props.history.push('/login');
    }

    render(){
        const userName = this.state.userName;
        return (
            <div className='col-md-8 offset-md-2 pt-5 mt-5'>
                <button className='btn btn-outline-secondary col-sm-4 col-md-3 mb-5 offset-sm-8' onClick={this.handleLogout} >Logout</button>
                <h1 className="mt-5 display-3 text-center">Welcome, {userName}</h1>
            </div>
        )
    }
}

export default withRouter(Dashboard);