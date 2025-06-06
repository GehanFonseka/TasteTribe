import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import Modal from 'react-modal';
import NavBar from '../../components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { FiSave } from "react-icons/fi";
import { TbPencilCancel } from "react-icons/tb";
import { FaCommentAlt } from "react-icons/fa";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Paper,
  IconButton,
  Avatar,
  Divider,
  InputAdornment,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled as muiStyled } from '@mui/material/styles';

Modal.setAppElement('#root');

// Custom styled components
const StyledSearchBar = styled(Paper)(({ theme }) => ({
  padding: '16px',
  width: '100%',
  height: 'calc(100vh - 64px)', // Adjust based on your navbar height
  position: 'sticky',
  top: '64px', // Match navbar height
  borderRadius: 0,
  boxShadow: 'none',
  borderRight: '1px solid rgba(0,0,0,0.12)',
  marginTop: '60px'
}));

const PostsContainer = styled(Box)(({ theme }) => ({
  padding: '20px',
  flex: 1,
  maxWidth: '800px',
  margin: '60px auto 0', // Changed from 40px to 60px
}));

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: '20px',
  borderRadius: 15,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Increased shadow opacity from 0.05 to 0.1
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)' // Increased hover shadow opacity from 0.1 to 0.15
  },
  '& .action_btn_icon_post .action_btn_icon:first-child': {
    background: '#047857', // Changed from gradient to solid color #047857
    color: 'white',
    borderRadius: '5px',
    padding: '5px'
  },
  '& .action_btn_icon_post .action_btn_icon:last-child': {
    color: '#ff4444',
    padding: '5px',
    
  },
  '& .likebtn, & .combtn, & .add_coment_btn': {
    color: '#047857' // Changed from #1976d2 to #047857
  }
}));

const StyledContainer = muiStyled(Box)(({ theme }) => ({
  // Add font family variables at the top
  '& *': {
    fontFamily: "'Inter', sans-serif",
  },

  '& h1, & h2, & h3, & h4, & h5, & h6': {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
  },

  '& .add_coment_input': {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 400,
  },

  '& .comnt_card_username': {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
  },

  '& .comnt_card_coment': {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },

  '& .like_num': {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 500,
  },

  '& .media-collage': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    margin: '16px 0'
  },

  '& .media-item': {
    position: 'relative',
    aspectRatio: '16/9',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },

  '& .add_comennt_con': {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },

  '& .add_coment_input': {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#047857'
    }
  },

  '& .add_coment_btn': {
    color: '#047857',
    cursor: 'pointer',
    fontSize: '1.75rem', // Increased from default
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },

  '& .coment_full_card': {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    marginBottom: '12px',
    animation: 'slideDown 0.3s ease-out',
  },

  '& .comnt_card_username': {
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '4px'
  },

  '& .comnt_card_coment': {
    color: '#64748b'
  },

  '& .like_coment_lne': {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '12px 0'
  },

  '& .like_btn_con': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  '& .likebtn, & .combtn': {
    color: '#047857',
    cursor: 'pointer',
    fontSize: '1.95rem', // Increased from default
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },

  '& .add_new_btn': {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    background: '#047857',
    color: 'white',
    width: '74px',    // Increased from 48px
    height: '74px',   // Increased from 48px
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      background: '#10b981'
    }
  },

  '& .add_new_btn_icon': {
    fontSize: '2rem',  // Increased from 1.25rem
  },

  '& .flow_btn': {
    backgroundColor: '#047857',
    color: 'white',
    '&:hover': {
      backgroundColor: '#10b981'
    }
  },

  '& .flow_btn_unfalow': {
    backgroundColor: '#ef4444',
    color: 'white',
    '&:hover': {
      backgroundColor: '#dc2626'
    }
  },

  '& .edit_comment_input': {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    '&:focus': {
      outline: 'none',
      borderColor: '#047857'
    }
  },

  '& .coment_btn': {
    color: '#047857',
    cursor: 'pointer',
    margin: '0 15px',      // Increased from 12px
    fontSize: '2.9rem',    // Increased from 2rem
    padding: '12px',       // Increased from 10px
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#10b981'
    }
  },

  '& .action_btn_icon': {
    fontSize: '2.5rem', // Increased from 1.75rem
    padding: '12px',    // Increased from 8px
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },

  '& .action_btn_icon_post': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',    // Increased gap between icons
    padding: '8px', // Added padding around icon container
  },

  '& .not_found_btn': {
    backgroundColor: '#047857',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#10b981'
    }
  },

  '& .comments-section': {
    maxHeight: 0,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out',
    
    '&.active': {
      maxHeight: '500px',
      overflow: 'auto'
    }
  },

  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}));

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]); // State to track followed users
  const [newComment, setNewComment] = useState({}); // State for new comments
  const [editingComment, setEditingComment] = useState({}); // State for editing comments
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [activeComments, setActiveComments] = useState(null); // Track which post's comments are visible
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem('userID'); // Get the logged-in user's ID

  useEffect(() => {
    // Fetch all posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        setPosts(response.data);
        setFilteredPosts(response.data); // Initially show all posts

        // Fetch post owners' names
        const userIDs = [...new Set(response.data.map((post) => post.userID))]; // Get unique userIDs
        const ownerPromises = userIDs.map((userID) =>
          axios.get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                // Handle case where user is deleted
                console.warn(`User with ID ${userID} not found. Removing their posts.`);
                setPosts((prevPosts) => prevPosts.filter((post) => post.userID !== userID));
                setFilteredPosts((prevFilteredPosts) => prevFilteredPosts.filter((post) => post.userID !== userID));
              } else {
                console.error(`Error fetching user details for userID ${userID}:`, error);
              }
              return { userID, fullName: 'Anonymous' };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        console.log('Post Owners Map:', ownerMap); // Debug log to verify postOwners map
        setPostOwners(ownerMap);
      } catch (error) {
        console.error('Error fetching posts:', error); // Log error for fetching posts
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userID = localStorage.getItem('userID');
      if (userID) {
        try {
          const response = await axios.get(`http://localhost:8080/user/${userID}/followedUsers`);
          setFollowedUsers(response.data);
        } catch (error) {
          console.error('Error fetching followed users:', error);
        }
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId)); // Remove the deleted post from the UI
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId)); // Update filtered posts
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`); // Navigate to the UpdatePost page with the post ID
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      // Show all posts
      setFilteredPosts(posts);
    } else {
      // Filter posts by logged-in user ID
      setFilteredPosts(posts.filter((post) => post.userID === loggedInUserID));
    }
    setShowMyPosts(!showMyPosts); // Toggle the state
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/posts/${postId}/like`, null, {
        params: { userID },
      });

      // Update the specific post's likes in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleFollowToggle = async (postOwnerID) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to follow/unfollow users.');
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        // Unfollow logic
        await axios.put(`http://localhost:8080/user/${userID}/unfollow`, { unfollowUserID: postOwnerID });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        // Follow logic
        await axios.put(`http://localhost:8080/user/${userID}/follow`, { followUserID: postOwnerID });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to comment.');
      return;
    }
    const content = newComment[postId] || ''; // Get the comment content for the specific post
    if (!content.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, {
        userID,
        content,
      });

      // Update the specific post's comments in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const userID = localStorage.getItem('userID');
    try {
      await axios.delete(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        params: { userID },
      });

      // Update state to remove the deleted comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSaveComment = async (postId, commentId, content) => {
    try {
      const userID = localStorage.getItem('userID');
      await axios.put(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        userID,
        content,
      });

      // Update the comment in state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setEditingComment({}); // Clear editing state
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter posts based on title, description, or category
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const toggleComments = (postId) => {
    setActiveComments(activeComments === postId ? null : postId);
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  return (
    <StyledContainer>
      <NavBar />
      <Box sx={{ 
        display: 'flex', 
        bgcolor: '#ffffff', // Changed from '#f5f5f5' to white
        minHeight: 'calc(100vh - 64px)' // Adjust based on navbar height
      }}>
{/* Left side - Search */}

<Box sx={{ width: '400px', flexShrink: 0, mt: -9}}>
  <StyledSearchBar elevation={0} sx={{ bgcolor: '#0F172A', color: '#ffffff' }}> {/* Updated background and text color */}
    <Typography variant="h6" sx={{ mb: 2, color: '#10b981' }}> {/* Updated text color */}
      Search Posts
    </Typography>
    <TextField
      fullWidth
      placeholder="Search by title, description, or category"
      value={searchQuery}
      onChange={handleSearch}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#10b981' }} /> {/* Updated icon color */}
          </InputAdornment>
        ),
        style: { color: '#ffffff' } // Updated input text color
      }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#10b981', // Updated border color
          },
          '&:hover fieldset': {
            borderColor: '#047857', // Updated hover border color
          },
          '&.Mui-focused fieldset': {
            borderColor: '#10b981', // Updated focus border color
          },
        },
        '& .MuiInputBase-input': {
          color: '#ffffff', // Updated input text color
        },
        '& .MuiInputLabel-root': {
          color: '#ffffff', // Updated placeholder text color
        },
      }}
    />
  </StyledSearchBar>
</Box>

        {/* Right side - Posts */}
        <PostsContainer>
          {filteredPosts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>No posts found</Typography>
              <button className='not_found_btn' onClick={() => navigate('/addNewPost')}>
                Create New Post
              </button>
            </Paper>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id}>
                <CardContent>
                  {/* User Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#047857' }}> {/* Changed from primary.main to #047857 */}
                        {(postOwners[post.userID] || 'A')[0]}
                      </Avatar>
                      <Typography 
                        variant="subtitle1" 
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500
                        }}
                      >
                        {postOwners[post.userID] || 'Anonymous'}
                      </Typography>
                    </Box>
                    {/* Existing follow/edit buttons with updated styling */}
                    {post.userID !== loggedInUserID ? (
                      <button
                        className={followedUsers.includes(post.userID) ? 'flow_btn_unfalow' : 'flow_btn'}
                        onClick={() => handleFollowToggle(post.userID)}
                        style={{
                          borderRadius: '20px',
                          padding: '6px 16px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {followedUsers.includes(post.userID) ? 'Unfollow' : 'Follow'}
                      </button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Existing action buttons */}
                        <div className='action_btn_icon_post'>
                          <FaEdit
                            onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                          <RiDeleteBin6Fill
                            onClick={() => handleDelete(post.id)}
                            className='action_btn_icon' />
                        </div>
                      </Box>
                    )}
                  </Box>

                  {/* Post Content */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: "pre-line",
                        color: 'text.secondary',
                        mb: 1
                      }}
                    >
                      {post.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Category: {post.category || 'Uncategorized'}
                    </Typography>
                  </Box>

                  {/* Existing media collage */}
                  <div className="media-collage">
                    {post.media.slice(0, 4).map((mediaUrl, index) => (
                      <div
                        key={index}
                        className={`media-item ${post.media.length > 4 && index === 3 ? 'media-overlay' : ''}`}
                        onClick={() => openModal(mediaUrl)}
                      >
                        {mediaUrl.endsWith('.mp4') ? (
                          <video controls>
                            <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img src={`http://localhost:8080${mediaUrl}`} alt="Post Media" />
                        )}
                        {post.media.length > 4 && index === 3 && (
                          <div className="overlay-text">+{post.media.length - 4}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Divider sx={{ my: 2 }} />

                  {/* Updated like/comment section */}
                  <div className='like_coment_lne'>
                    <div className='like_btn_con'>
                      <BiSolidLike
                        className={post.likes?.[localStorage.getItem('userID')] ? 'unlikebtn' : 'likebtn'}
                        onClick={() => handleLike(post.id)}
                      >
                        {post.likes?.[localStorage.getItem('userID')] ? 'Unlike' : 'Like'}
                      </BiSolidLike>
                      <p className='like_num'>
                        {Object.values(post.likes || {}).filter((liked) => liked).length}
                      </p>
                    </div>
                    <div className=''>
                      <div className='like_btn_con'>
                        <FaCommentAlt
                          className='combtn'
                          onClick={() => toggleComments(post.id)}
                        />
                        <p className='like_num'>
                          {post.comments?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comments section - Only show when active */}
                  {activeComments === post.id && (
                    <Box sx={{ mt: 2 }}>
                      <div className='add_comennt_con'>
                        <input
                          type="text"
                          className='add_coment_input'
                          placeholder="Write a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) =>
                            setNewComment({ ...newComment, [post.id]: e.target.value })
                          }
                        />
                        <IoSend
                          onClick={() => handleAddComment(post.id)}
                          className='add_coment_btn'
                        />
                      </div>
                      {post.comments?.map((comment) => (
                        <div key={comment.id} className='coment_full_card'>
                          <div className='comnt_card'>
                            <p className='comnt_card_username'>{comment.userFullName}</p>
                            {editingComment.id === comment.id ? (
                              <input
                                type="text"
                                className='edit_comment_input'
                                value={editingComment.content}
                                onChange={(e) =>
                                  setEditingComment({ ...editingComment, content: e.target.value })
                                }
                                autoFocus
                              />
                            ) : (
                              <p className='comnt_card_coment'>{comment.content}</p>
                            )}
                          </div>
                          {/* Comment actions */}
                          <div className='coment_action_btn'>
                            {comment.userID === loggedInUserID && (
                              <>
                                {editingComment.id === comment.id ? (
                                  <>
                                    <FiSave className='coment_btn'
                                      onClick={() => handleSaveComment(post.id, comment.id, editingComment.content)}
                                    />
                                    <TbPencilCancel className='coment_btn'
                                      onClick={() => setEditingComment({})}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <GrUpdate className='coment_btn'
                                      onClick={() => setEditingComment({ id: comment.id, content: comment.content })}
                                    />
                                    <MdDelete className='coment_btn'
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                    />
                                  </>
                                )}
                              </>
                            )}
                            {post.userID === loggedInUserID && comment.userID !== loggedInUserID && (
                              <button
                                className='coment_btn'
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </PostCard>
            ))
          )}
        </PostsContainer>

        {/* Keep the add button */}
        <div className='add_new_btn' onClick={() => navigate('/addNewPost')}>
          <IoIosCreate className='add_new_btn_icon' />
        </div>
      </Box>

      {/* Modal for displaying full media */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="media-modal"
        overlayClassName="media-modal-overlay"
      >
        <button className="close-modal-btn" onClick={closeModal}>x</button>
        {selectedMedia && selectedMedia.endsWith('.mp4') ? (
          <video controls className="modal-media">
            <source src={`http://localhost:8080${selectedMedia}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={`http://localhost:8080${selectedMedia}`} alt="Full Media" className="modal-media" />
        )}
      </Modal>
    </StyledContainer>
  );
}

export default AllPost;
