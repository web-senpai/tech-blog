---
title: 'CUnlocking the Power of React and Firebase: A Guide to Secure Authentication'
metaTitle: 'Consume Rest Api using react.js'
metaDesc: 'We will consume rest api in React using Redux toolkit and RTK query'
socialImage: images/react.jpg
date: '2022-08-16'
tags:
  - nodejs
  - sequelize
  - express.js
  - mysql
  - orm
  - rest api
---
# React with Redux
Today we will learn how to consume rest api in react using redux toolkit and rtk query.We will follow the best practices to implement this task. So have patience and read carefully.If it feels overwhelming at first don't worry all your confusions will be cleared in summary section. Things we need to implement that:
- Redux toolkit
- React bootstrap
- RTK Query


## Step 1: Design Common components

### components/Header.js
```js
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Video Api</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className="btn" onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;

```

### components/Spinner.js

```js
function Spinner() {
    return (
      <div className='loadingSpinnerContainer'>
        <div className='loadingSpinner'></div>
      </div>
    )
  }
  
  export default Spinner
  
```

## Step 2: Create Components

### pages/login.jsx

```js
import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { useFormik ,Formik,ErrorMessage} from "formik";
import * as Yup from 'yup';


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])


  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }
    dispatch(login(userData))
  }
  
  
  if (isLoading) {
    return <Spinner />
  }
  
  return (
    <>
      <section className='heading log'>
        <h1>
          <FaSignInAlt className='alignIcon'/> Sign In
        </h1>
      </section>

      <section className='form'>
            
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Sign In
            </button>
          </div>
        </form>
        
      </section>
    </>
  )
}

export default Login

```

### pages/register.jsx

```js
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  })

  const {  email, password, password2 } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
    
        email,
        password,
      }
      console.log(userData)
      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
  
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register

```

### pages/Dashboard.jsx

```js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import VideoForm from "../components/VideoForm";
import VideoTable from "../components/VideoTable";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [id, setId] = useState();
  const [update,setUpdate] = useState(false);
  const [inputField, setInputField] = useState({
    title: "",
    category: "",
    description: "",
    avg_sessiontime: "",
    video_duration: "",
    video_url: "",
  });

  return (
    <>
      <VideoForm
        inputField={inputField}
        setInputField={setInputField}
        id={id}
        update={update}
        setUpdate={setUpdate}
      />

      <VideoTable setInputField={setInputField} setId={setId} setUpdate={setUpdate}/>
    </>
  );
}

export default Dashboard;

```

## Step 3: Setup Routes

### App.js
```js
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Register from './pages/Register'
import Login from './pages/Login'

import './App.css';
function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

```

## Step 4: Setup Firebase Config

### app/config/firebase-config.js
```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZVABn8_f9gwtNYhtDaHB-DANiu23zVzU",
  authDomain: "fir-auth-79a7f.firebaseapp.com",
  projectId: "fir-auth-79a7f",
  storageBucket: "fir-auth-79a7f.appspot.com",
  messagingSenderId: "769965611733",
  appId: "1:769965611733:web:471202fab28b0123a9605c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

```

## Step 5: Setup Redux Store
### app/store.js

```js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from '../features/api/apiSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

```

## Step 6: Setup AuthSlice

### authservice.js
```js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../app/configs/firebase-config";

const register = async (userData) => {
  const registerEmail = userData.email;
  const registerPassword = userData.password;
  const userInfo = await createUserWithEmailAndPassword(
    auth,
    registerEmail,
    registerPassword
  );

  let token = await userInfo.user.getIdToken();
  console.log(token);
  localStorage.setItem("user", token);

  const user = userInfo.user.email;
  return user;
};

const login = async (userData) => {
  const loginEmail = userData.email;
  const loginPassword = userData.password;
  const userInfo = await signInWithEmailAndPassword(
    auth,
    loginEmail,
    loginPassword
  );
  let token = await userInfo.user.getIdToken();
  console.log(token);
  localStorage.setItem("user", token);

  const user = userInfo.user.email;
  return user;
};

const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};

export default authService;

```
### authSlice.js
```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { auth } from "../../app/configs/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

let user = localStorage.getItem("user");

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

```

## Step 7: Setup Rest Api Consuming Slice

### Apislice.js

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/",
  }),
  tagTypes: ["Video", "Category"],
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => "video/videolist",
      providesTags: ["Video"],
    }),
    getCategory: builder.query({
      query: () => "category/categorylist",
      providesTags: ["Category"],
    }),
    addNewVideo: builder.mutation({
      query: (payload) => ({
        url: "video/addvideo",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Video"],
    }),
    updateVideo: builder.mutation({
      query: (payload) => {
        console.log(payload);
        const { video_id, ...body } = payload;
        return {
          url: `video/editvideo/${video_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Video"],
    }),
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `video/deletevideo/${id}`,
        method: "DELETE",
        //credentials: 'include',
      }),
      invalidatesTags: ["Video"],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetCategoryQuery,
  useAddNewVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = apiSlice;

```

## Step 8: Create extra components

### Modal.js
```js
import Modal from "react-bootstrap/Modal";
import ReactPlayer from "react-player";

function VideoModal(props) {
  const url = '"' + props?.video?.video_url + '"';
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props?.video?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactPlayer url={url} width="100%" />
      </Modal.Body>
    </Modal>
  );
}
export default VideoModal;

```
### Table.js
```js
import { useState } from "react";
import VideoModal from "./Modal";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import { AiOutlinePlayCircle } from "react-icons/ai";
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
} from "../features/api/apiSlice";

const VideoTable = ({ setInputField, setId, setUpdate }) => {
  const [deleteVideo] = useDeleteVideoMutation();
  const {
    data: videos,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetVideosQuery({ refetchOnMountOrArgChange: true });

  const setVideoData = (data) => {
    setId(data.video_id);
    setInputField({
      title: data.title,
      category: data.categories.category,
      description: data.description,
      avg_sessiontime: data.avg_sessiontime,
      video_duration: data.video_duration,
      video_url: data.video_url,
    });

    setUpdate(true);
  };

  let videoContent;
  const [modalShow, setModalShow] = useState(false);
  const [modalvideo, setModalVideo] = useState();
  const handleShowModal = (video) => {
    setModalShow(true);
    setModalVideo(video);
    console.log(modalvideo);
  };

  if (isGetLoading) {
    videoContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isGetSuccess) {
    videoContent = (
      <>
        <Card className="table-responsive">
          <Table striped bordered className="mt-2 table-responsive table-sm">
            <thead className="stuckhead">
              <tr>
                <th>Play</th>
                <th>Title</th>
                <th>Category</th>
                <th>VideoDuration</th>
                <th>Video URL</th>
                <th>Description</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {videos?.map((video) => (
                <tr key={video.video_id}>
                  <td>
                    {" "}
                    <AiOutlinePlayCircle
                      onClick={() => handleShowModal(video)}
                      className="mx-2"
                    />
                  </td>
                  <td>
                    {video.title}

                    <VideoModal
                      video={modalvideo}
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                    />
                  </td>
                  <td>{video.categories.category}</td>
                  <td>{video.video_duration}</td>
                  <td>{video.video_url.slice(0, 20) + "..."}</td>
                  <td>{video.description.slice(0, 20) + "..."}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      onClick={() => setVideoData(video)}
                      className="btn btn-dark"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="ms-3 px-3">
                    <button
                      onClick={() => deleteVideo(video.video_id)}
                      className="btn btn-dark me-2"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </>
    );
  } else if (isGetError) {
    videoContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    );
  }

  return (
    <div className="row mt-4">
      <div className="col-lg-12">
        <div className="row">{videoContent}</div>
      </div>
    </div>
  );
};

export default VideoTable;

```
### Form.js
```js
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useFormik } from "formik";
import * as Yup from "yup";
import Badge from "react-bootstrap/Badge";
import { Card } from "react-bootstrap";
import {
  useGetCategoryQuery,
  useAddNewVideoMutation,
  useUpdateVideoMutation,
} from "../features/api/apiSlice";

const VideoForm = ({ setInputField, inputField, id, update, setUpdate }) => {
  const [addNewVideo] = useAddNewVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const {
    data: categories,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetCategoryQuery({ refetchOnMountOrArgChange: true });

  const inputsHandler = (e) => {
    setInputField((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (data) => {
    let formData = {
      title: data.title,
      category: data.category,
      description: data.description,
      avg_sessiontime: data.avg_sessiontime,
      video_duration: data.video_duration,
      video_url: data.video_url,
    };

    addNewVideo(formData)
      .unwrap()
      .then(() => {
        setInputField(() => ({
          title: "",
          category: "",
          description: "",
          avg_sessiontime: "",
          video_duration: "",
          video_url: "",
        }));
      })
      .then((error) => {
        console.log(error);
      });
  };

  const onEditData = () => {
    updateVideo({
      video_id: id,
      title: inputField.title,
      //category: inputField.category,
      description: inputField.description,
      avg_sessiontime: inputField.avg_sessiontime,
      video_duration: inputField.video_duration,
      video_url: inputField.video_url,
    });

    setUpdate(false);

    setInputField(() => ({
      title: "",
      category: "",
      description: "",
      avg_sessiontime: "",
      video_duration: "",
      video_url: "",
    }));
  };

  const handleReset = () => {
    setInputField(() => ({
      title: "",
      category: "",
      description: "",
      avg_sessiontime: "",
      video_duration: "",
      video_url: "",
    }));
  };

  const validationSchema = Yup.object({
    // category: Yup.string().required("Please select a product").oneOf(categories),
    title: Yup.string()
      .required("Title can not be empty")
      .max(10, "Title must not exceed 10 characters"),
    description: Yup.string()
      .required("Can't be empty")
      .trim("Can't be empty string"),
    category: Yup.string().required("Select a category"),
    avg_sessiontime: Yup.string()
      .required("Can't be empty")
      .matches(/[0-9]{2}:[0-9]{2}:[0-9]{2}/, "duration format- hh:mm:ss"),
    video_duration: Yup.string()
      .required("Can't be empty")
      .matches(/[0-9]{2}:[0-9]{2}:[0-9]{2}/, "duration format- hh:mm:ss"),
    video_url: Yup.string()
      .required("Can't be empty")
      .min(3, "Url is too short")
      .url("invalid url"),
  });

  const formik = useFormik({
    initialValues: inputField,
    enableReinitialize: true,
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: true,
    onSubmit: (values) => {
      update ? onEditData() : onSubmit(values);
    },
  });

  let categoryOptions;
  if (isGetSuccess) {
    categoryOptions = categories?.map((category, category_id) => (
      <option key={category_id}>{category.category}</option>
    ));
  } else if (isGetError) {
    categoryOptions = <option> ... </option>;
    console.log("error fetching category");
    console.log(getError);
  }

  return (
    <Card className="lefter p-2">
      <h3> Add Video</h3>
      <Form onSubmit={formik.handleSubmit}>
        <Row className="mb-3 ">
          <Col className="col-lg-8 col-12">
            <FloatingLabel controlId="title" label="Title">
              <Form.Control
                type="text"
                name="title"
                placeholder="Title"
                value={inputField.title}
                onChange={inputsHandler}
              />
            </FloatingLabel>
            <Badge bg="danger" className="mt-2">
              {formik.errors.title ? formik.errors.title : null}
            </Badge>
          </Col>
          <Col className="col-lg-4 col-12 mt-lg-0 mt-2">
            <FloatingLabel controlId="category">
              <Form.Select
                name="category"
                value={inputField.category}
                onChange={inputsHandler}
              >
                <option>Category. . .</option>
                {categoryOptions}
              </Form.Select>
            </FloatingLabel>
            <Badge bg="danger" className="mt-2">
              {formik.errors.category ? formik.errors.category : null}
            </Badge>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col className="col-lg-3 col-12">
            <FloatingLabel
              controlId="avg_sessiontime"
              label="Avg. Session Time"
            >
              <Form.Control
                name="avg_sessiontime"
                type="text"
                value={inputField.avg_sessiontime}
                placeholder="Avg. Session Time"
                onChange={inputsHandler}
              />
            </FloatingLabel>
            <Badge bg="danger" className="mt-2 ">
              {formik.errors.avg_sessiontime
                ? formik.errors.avg_sessiontime
                : null}
            </Badge>
          </Col>
          <Col className="col-lg-3 col-12 mt-lg-0 mt-2">
            <FloatingLabel controlId="video_duration" label="Video Duration">
              <Form.Control
                name="video_duration"
                type="text"
                value={inputField.video_duration}
                placeholder="Video Duration"
                onChange={inputsHandler}
              />
            </FloatingLabel>
            <Badge bg="danger" className="mt-2">
              {formik.errors.video_duration
                ? formik.errors.video_duration
                : null}
            </Badge>
          </Col>
          <Col className="col-lg-6 col-12 mt-lg-0 mt-2">
            <FloatingLabel controlId="video_url" label="Video URL">
              <Form.Control
                name="video_url"
                type="text"
                value={inputField.video_url}
                placeholder="Video URL"
                onChange={inputsHandler}
              />
            </FloatingLabel>
            <Badge bg="danger" className="mt-2">
              {formik.errors.video_url ? formik.errors.video_url : null}
            </Badge>
          </Col>
        </Row>

        <Row className="mb-1 p-3">
          {/* <FloatingLabel controlId="description" label="Description"> */}
          <Form.Control
            name="description"
            as="textarea"
            placeholder="Description. . ."
            value={inputField.description}
            rows={3}
            onChange={inputsHandler}
          />
          {/* </FloatingLabel> */}
          <Badge bg="danger" className="mt-2">
            {formik.errors.description ? formik.errors.description : null}
          </Badge>
        </Row>
      

        <div className="d-flex flex-row-reverse">
          <div className="p-2">
            <button className="btn btn-primary me-2" type="submit">
              {update ? "Update Video" : "Add Video"}
            </button>
          </div>
          <div className="p-2">
            {" "}
            <button
              onClick={handleReset}
              className="btn btn-danger"
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default VideoForm;

```

## Step 9:

run these commands on terminal

```js
npm run dev
```


