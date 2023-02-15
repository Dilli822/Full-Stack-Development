import React, {Component} from "react";
import Crud from "../crud/crud";
import axios from "axios";

class Home extends Component{
    constructor(props){
        super(props);
    }
    render(){
     
        return(
            
            <div>
              
               <Crud/>
                <button>Logout</button>
            </div>
        )
    }
}

export default Home;