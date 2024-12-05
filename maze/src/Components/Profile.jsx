import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [bio, setBio] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile on component mount
    useEffect(() => {
        Axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
            .then(response => {
                setUserDetails(response.data);
                setBio(response.data.bio || ''); // Initialize bio if present
            })
            .catch(err => {
                setError('Failed to load profile. Please log in again.');
                navigate('/login'); // Redirect to login if the profile is not fetched
            });
    }, [navigate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Submit updated profile
    const handleUpdate = () => {
        Axios.put('http://localhost:3000/auth/profile', updatedDetails, { withCredentials: true })
            .then(response => {
                setUserDetails(response.data);
                setBio(response.data.bio || '');
                setIsEditing(false); // Exit edit mode
            })
            .catch(err => {
                setError('Failed to update profile. Please try again.');
            });
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {!isEditing ? (
                <>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Score:</strong> {userDetails.points}</p>
                    <p><strong>Bio:</strong> {bio || 'No bio available. Add one!'}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </>
            ) : (
                <form className="edit-profile-form">
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            defaultValue={userDetails.username}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Bio:
                        <textarea
                            name="bio"
                            defaultValue={bio}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button type="button" onClick={handleUpdate}>Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Profile;
