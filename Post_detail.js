import React , { createElement, useState } from "react";
import { connect } from "react-redux";
import async from 'q'
import axios from "axios";

import {Row, Col,
  Form,
  Select,
  InputNumber,
  Input,
  Radio,Card,Carousel,
  Button,Modal,
  DatePicker,Rate,
  Spin , Slider ,Skeleton, Switch, 
   Avatar ,Comment, Tooltip, notification
} from "antd";
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

import CommentForm from '../containers/Comment_Form' 
import Order_Form from '../containers/Order_Form'

const formItemLayout = {
  wrapperCol: { span: 12, offset: 6 }
};
const { Option } = Select; 
const {TextArea} = Input

class PostDetail extends React.Component{
      
    state = {
        vendor_profile : [] ,
        post_detail : [], 
        comments_made : [] ,
        rating : 3,
        loading  : true ,
        key: 'tab1',
        noTitleKey: 'app',
        name : '',
        email : '' ,
        

        
    }

    Get_Vendor_Profile = async(Vendor_id) =>{
      
      await axios.get(`http://127.0.0.1:8000/core_api/vendors_profile_public/${Vendor_id}/`)
      .then(res =>{
        this.setState({
          vendor_profile: res.data
      })
       console.log('ven',this.state.vendor_profile)  
     })
    }

    model_id = this.props.match.params.PostDetailID
    Get_reverse_url_id = async() => {
        const model_id = this.props.match.params.PostDetailID
        await axios.get(`http://127.0.0.1:8000/core_api/post_detail/${model_id}/`)
        .then(res =>{
            this.setState({
                post_detail : res.data ,
                loading : false
                })
            if (this.state.loading === false){
        
              const parse_vendor = this.state.post_detail.Owner_id
              console.log('this is the  vendor id', parse_vendor)
              // USED THIS FUNCTION RETRIEVE VENDOR'S ID
              this.Get_Vendor_Profile(parse_vendor)
            }
        })
    }
    
    
    //Fetches commetn
    Get_Comments = () =>{
        const model_id = this.props.match.params.PostDetailID
         axios.get(`http://127.0.0.1:8000/core_api/comment_list/${model_id}/`)
        .then(res =>{
            this.setState({
                comments_made : res.data ,
                loading : false
                })
          
        })

    };
    // Ends Comment Fetching
    
      Ratings = async()=>{
        const parse_id= this.model_id;
        await axios.get(`http://127.0.0.1:8000/core_api/post_rating/${parse_id}/`)
        .then( res =>{
          this.setState({
            rating: Math.round(res.data)
          })
          console.log('rating points', Math.round(res.data))
        })
      }  
      
      

      componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
          if (newProps.token !== undefined && newProps.token !== null) {
             
          }
        }
      }

      componentDidMount = () =>{
        this.Get_reverse_url_id()
       this.Get_Comments()
       this.Ratings()
      
       };

       
    render(){
     const   { post_detail ,vendor_profile, comments_made, loading,  rating } = this.state;
     const model_id = this.props.match.params.PostDetailID
     console.log(post_detail.GigImage2);
     
      return(

           <>
      
            <div className="flex-container">
              <div className="shift80">
                  <img 
                  className="post_detail_image"
                  alt ='Image Appears here'
                  src={post_detail.GigImage1} />
              </div>
 
              <div className="shift20">
                  <div className="contact-card">
                    <div className="card-container">
                    <span>
                          <img 
                  src="https://az742041.vo.msecnd.net/vcsites/vcimages/resource/uploads/CompanyLogo/thumbs/636946622002390653_1.jpg" />
                    </span>
                    <span>
                     <h4>
                     <a  href={`/Vendor_Profile/${vendor_profile.id}`}>
                     Posted by   {vendor_profile.BusinessName}
                      </a>
                     </h4>
                    </span>
                        <div className="card-title">
                        
                          {post_detail.GigTitle}
                        </div>
                        <div className="card-text">
                          {post_detail.GigDescription}
                        </div>

                        <div className="card-location">
                         Location: {post_detail.GigLocation}
                        </div>

                        <div className="card-date">
                        Posted on:  {post_detail.GigPostDate}
                        </div>

                        <div className="card-price">
                        Price  ₦ {post_detail.GigPrice}
                        </div>
                        
                         <div className="">
                        <Order_Form vendor_id = {vendor_profile.id} post_id = {model_id} />
                        </div>

                    </div>
                  </div>
                </div>
                
            </div> 

            <div className="flex-container">
              <div className="shift100">
                      <div className="description-card">
                          <div className="description-header">
                            <h2>
                              Description
                            </h2>
                            <Rate disabled defaultValue={rating} />
                          </div>
                        <div className="description-card-text">
                          {post_detail.GigDescription}
                        </div>
                      </div>
              </div>
          </div>

          <div className="flex-container">
               <div className="shift50">

               {
                comments_made.map((c)=>(
                  <>
                  <Rate disabled defaultValue={c.rating} />

                  <Comment
                  author={c.name}
                  avatar={
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      alt="Han Solo"
                    />
                  }
                  content={
                    <p>
                      {c.comments}
                    </p>
                  }
                  datetime={
                    <Tooltip title>
                      <span>{c.created}</span>
                    </Tooltip>
                  }
                />
                </>
                 ))
               }

               </div>

                  <div className="shift50">
                    <CommentForm post_id = {model_id} />
                  </div>

          </div>

           </>
           //Render and return ends here
        )
    }

}
const mapStateToProps = state => {
  return {
    token: state.auth.token 
  };
};

export default connect(
  mapStateToProps,
  null
)(PostDetail);
