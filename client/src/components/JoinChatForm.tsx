import { useState } from "react";
import { Input, Button, Card, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface JoinChatFormProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  handleCreatedUser: () => void;
  setProfileImage: (image: File | null) => void; // New function for profile image
}

const JoinChatForm: React.FC<JoinChatFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  handleCreatedUser,
  setProfileImage
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file); // Set the selected image
      setPreview(URL.createObjectURL(file)); // Generate preview
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg p-6 rounded-lg bg-white">
      <Title level={3} className="text-center text-blue-500">Join the Chat</Title>

      {/* Username Input */}
      <div className="w-full">
        <Input
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3 p-2 rounded-md border border-gray-300"
        />
      </div>

      {/* Email Input */}
      <div className="mt-3 w-full">
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 p-2 rounded-md border border-gray-300"
        />
      </div>

      {/* Image Upload */}
      <div className="mt-3 w-full">
        <label className="block mb-2 text-gray-600">Upload Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-3 p-2 w-full border border-gray-300 rounded-md"
        />
        {/* Preview Uploaded Image */}
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full mx-auto mt-2 object-cover"
          />
        )}
      </div>

      {/* Join Chat Button */}
      <div className="mt-3 w-full">
        <Button type="primary" className="w-full bg-blue-500" onClick={handleCreatedUser}>
          Join Chat
        </Button>
      </div>
    </Card>
  );
};

export default JoinChatForm;
