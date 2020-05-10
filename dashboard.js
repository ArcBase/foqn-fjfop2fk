import React, { Component } from 'react'
import Pusher from 'pusher-js';
 
import { Link, withRouter } from 'react-router-dom';
import {Bar, Line} from 'react-chartjs-2';
import axios from "axios";
import { connect } from "react-redux";

import TemporaryDrawer from './Sidebar/SideNav'

const Profile_id_url  = 'http://127.0.0.1:8000/stream/get_profile_id/'
const Profile_url = 'http://127.0.0.1:8000/stream/profile_view/'
const UserMembership_url  = 'http://127.0.0.1:8000/stream/user_membership' 
const Membership_url = 'http://127.0.0.1:8000/stream/list_membership'
const Post_Analytics_url = 'http://127.0.0.1:8000/analytics/rankings'

const UserPost_url = 'http://127.0.0.1:8000/stream/view_post/'

class ProfileDashboard extends Component {
 
    // The User Proifle State
    state = {
        profile : [] ,
        profile_id : [],
        membership : [], 
        chartData : [],
        loading : false ,
        error : null , 
        post_views_x : [],
        post_name_y :[] ,
        average_views : [],
        user_post : [], 
          }
    
    //Check User Authenticated State
    Verify_Authentication =()=>{
      const {isAuth} = this.props
      if (isAuth === true){
        
      }else{
        
       
      }
    }


     Analysis = async(token) =>{
      const Data_Labels = []
      const Data_Points = []
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      };
      await axios.get(Post_Analytics_url)
      .then(
          res =>{
           const Fetched_Data = res.data
            const New_Data ={
             'Labels': res.data.PostLabels[0,2],
             'Points': res.data.PostViews[0,2],
           }
           
            this.setState({
              chartData:{
                labels: Fetched_Data.PostLabels,
                datasets:[
                  {
                    label:'Impressions',
                    data: Fetched_Data.PostViews ,
                    backgroundColor:[
                      
                      'rgba(18, 30, 198)'
                    ]
                  }
                ]
              }
            })
             console.log('Analysis',New_Data)
          } )
      
      }


      Profile_detail = (token,profile_id) =>{
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };
          
          axios.get(`http://127.0.0.1:8000/stream/profile_view/${profile_id}`)
          .then(res =>{
            this.setState({
              profile: res.data
            })
            console.log('profile details',res.data)
          })
        
    }

    Profile_ID = async (token) =>{
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      };
      await axios.get(Profile_id_url)
      .then(res =>{
        const the_id = res.data
        this.setState({
          profile_id: res.data
        })
      });
      const {profile_id} = this.state
      const parse_profile_id = profile_id['Profile_id']
      console.log(parse_profile_id)
      await this.Profile_detail(token, parse_profile_id)

    }

    

    Get_User_Membership = (token) =>{
          axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };
        axios.get(UserMembership_url)
        .then(res =>{
            this.setState({
              membership : res.data[0]
            }); console.log('memberships',res.data)
        })
        .catch(e =>{
            console.log(e)
        }) 
    }

    Get_Post_Views = (token)=>{
          axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };
        axios.get(Post_Analytics_url)
        .then(res =>{
            this.setState({
              post_name_y : res.data.PostLabels,
              post_views_x : res.data.PostViews,
              average_views : Math.round(res.data.Average_view)
            }); console.log('Impression',res.data)
        })
        .catch(e =>{
            console.log(e)
        })
    }

    Get_User_post = (token) =>{
      axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        };
      axios.get(UserPost_url)
      .then(res =>{
          this.setState({
            user_post : res.data
          }); console.log('rep', res.data)
      })
      .catch(e =>{
          console.log(e)
      })
  }

    test_ws(){
      var pusher = new Pusher('8b827980b6cb1e62195c', {
        cluster: 'eu'
      });
      
      var channel = pusher.subscribe('my-channel');
      channel.bind('my-event', function(data) {
        alert(JSON.stringify(data));
        console.log(JSON.stringify(data))
      });
      console.log('tryiing...')
     
    }

    componentDidMount(){
      //this.test_ws()
      this.Verify_Authentication()
        this.Profile_ID(this.props.token)
        this.Get_User_Membership(this.props.token)
        this.Get_Post_Views(this.props.token)
      this.Get_User_post(this.props.token)
        this.Analysis(this.props.token)
         
       }
    
   

      componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
          if (newProps.token !== undefined && newProps.token !== null) {
            this.Profile_ID(newProps.token)
            this.Get_User_Membership(newProps.token)
            this.Get_Post_Views(newProps.token)
            this.Get_User_post(newProps.token)
            this.Analysis(newProps.token)
            
          }
        }
      }
  
    
    
    render() {
       
      
      
        const {profile , average_views  , membership , user_post} = this.state
        if (profile.Edited == false){

        }
  
        return (
          
            <>

              <TemporaryDrawer />

          
                <div
                style={{paddingLeft:20}}
                 className="container">
                  
                  <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
                  <div className="shift20">
                          <div className="top-card">
                              
                          <div className="top-card-title">
                              <h3 className="top-card-title">
                                Account Type
                              </h3>
                          </div>
                            <div className="grid grid-cols-2">
                            <div className="top-card-text">
                                {membership.membership}   
                            </div>  
                            <div className="pt-3">
                            <a href={`/membership_select`}>
                                Upgrade
                                </a>
                            </div>
                            </div>
                          </div>
                      </div>

                  <div className="shift20">
                      <div className="top-card">
                          
                      <div className="top-card-title">
                          <h3 className="top-card-title">
                            Inmpressions
                          </h3>
                      </div>
                        <div className="top-card-text">
                            {average_views}   
                        </div>
                      </div>
                  </div> 

                  <div className="shift20">
                      <div className="top-card">
                          
                      <div className="top-card-title">
                          <h3 className="top-card-title">
                            Post
                          </h3>
                      </div>
                        <div className="top-card-text">
                        <a href={`user_post`}>
                        View Your Post 
                        </a>
                        </div>
                      </div>
                  </div>

                  <div className="shift20">
                      <div className="top-card">
                          
                      <div className="top-card-title">
                          <h3 className="top-card-title">
                            Quotes
                          </h3>
                      </div>
                        <div className="top-card-text">
                        <a href={`/vendor_quotes/`}>
                        Click
                        </a>
                        </div>
                      </div>
                  </div>

                  </div>

                </div>   


               

                <div className="flex-container">
                    
                    <div className="shift20">
                    
                    <div className="snip1336 ">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg" alt="sample87" />
                    <figcaption>
                      <img src={profile.ProfilePicture} alt="profile-sample4" className="profile" />
                      <h2>{profile.User_First_Name}</h2>
                      <p>
                        {profile.Bio}
                      </p>
                      <a href="/edit_profile/" className="follow">
                        Edit Profile
                      </a>
                      <a href="#" className="info">More Info</a>
                    </figcaption>
                  </div>
                      </div>
                      
                  
                    <div className="shift50">
               
                    <div 
                   className="base-card ">
                   <Line
                         className =""
                         data={this.state.chartData}
                         options={{
                          responsive: true,
                         maintainAspectRatio : true,
                         title:{
                         display:this.props.displayTitle,
                         text:'Largest Cities In '+this.props.location,
                         fontSize:25
                         },
                         legend:{
                         display:this.props.displayLegend,
                         position:this.props.legendPosition
                         
                         }
                         }}
                    />
                   </div>

                   </div>

                   

                </div> 
       
            </>
            
          
        )
    };

};

const mapStateToProps = state => {
    return {
      token: state.auth.token ,
      isAuth: state.auth.token !== null 
    };
  };
  
export default connect(
    mapStateToProps,
    null
  )(ProfileDashboard);