
// import './App.css';
// import React,{Component} from "react";
// import axios from "axios";

// class App extends Component{
//   constructor(props){
//     super(props);
//     this.state = {
//       searchText: "",
//       loading: true,
//       error: false,
//       apiData: [],
//       dupApiData: [],
//     }
//   };

//   componentDidMount(){
//     this.getApiData();
//   }

//   getApiData = () =>{
//     let self = this;
//     axios.get('http://127.0.0.1:8000/api/notes/').then((res)=>{
//       console.log("res data is ");
      
//       console.log(res.data);
//       console.log(res.data.notes)
//       self.setState({
//         apiData: res.data.notes,
//         loading: false,
//         error: false,
//       })
//     }).catch((err)=>{
//       console.log(err);
//       self.setState({ error: true, loading: false })
//     })
//   }


//   render(){
//     return(
//       <div>
//           <div>App</div>
//         {
//         this.state.loading ? 
//         <div> data is loading </div> :

//         this.state.error ? <div> Error, Something went wrong </div> :

//         <div>
//           {/* <input onChange={this.handleChange}/>
//           <button onClick={this.handleSearch}>Search</button> */}
//           {this.state.apiData.map((data)=>
//           <div>
//             <ul>
//               <li>{data.id}  &nbsp;{data.content}</li>
//               <li>{data.category}</li>
//             </ul>
            
//             </div>
//           )}

//           {<div> {this.state.message}</div>}    
//         </div>
//         }
//       </div>
//     )
//   }
// }

// export default App;
