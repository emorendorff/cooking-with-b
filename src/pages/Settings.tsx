import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";

const PageWrapper = styled.div`
  padding-top: 64px;
  padding-bottom: 64px;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: #484848;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.h2`
  font-size: 16px;
  color: #6a0d2b;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #c6b7a8;
  text-align: left;
  text-transform: none;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  color: #484848;
  font-size: 14px;
`;

const Label = styled.span`
  color: #666;
`;

const Value = styled.span`
  color: #484848;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #c6b7a8;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6a0d2b;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  background-color: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #8a1d3b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #c6b7a8;
  color: #484848;
  margin-top: 16px;

  &:hover {
    background-color: #b5a699;
  }
`;

const Message = styled.p<{ $error?: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.$error ? "#d32f2f" : "#4caf50")};
  margin: 8px 0;
`;

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);
    setIsUpdatingEmail(true);

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMessage({
        text: "Confirmation email sent to your new address. Please check your inbox.",
        error: false,
      });
      setNewEmail("");
    } catch (error) {
      setEmailMessage({
        text: error instanceof Error ? error.message : "Failed to update email",
        error: true,
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "Passwords do not match", error: true });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        text: "Password must be at least 6 characters",
        error: true,
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setPasswordMessage({
        text: "Password updated successfully",
        error: false,
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({
        text:
          error instanceof Error ? error.message : "Failed to update password",
        error: true,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <PageWrapper>
      <Header />
      <Container>
        <Title>Settings</Title>

        <Section>
          <SectionHeader>Account Info</SectionHeader>
          <InfoRow>
            <Label>Email</Label>
            <Value>{user?.email || "Not set"}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Last Sign In</Label>
            <Value>{formatDate(user?.last_sign_in_at)}</Value>
          </InfoRow>
        </Section>

        <Section>
          <SectionHeader>Change Email</SectionHeader>
          <Form onSubmit={handleEmailChange}>
            <Input
              type="email"
              placeholder="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isUpdatingEmail || !newEmail}>
              {isUpdatingEmail ? "Updating..." : "Update Email"}
            </Button>
            {emailMessage && (
              <Message $error={emailMessage.error}>{emailMessage.text}</Message>
            )}
          </Form>
        </Section>

        <Section>
          <SectionHeader>Change Password</SectionHeader>
          <Form onSubmit={handlePasswordChange}>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
            {passwordMessage && (
              <Message $error={passwordMessage.error}>
                {passwordMessage.text}
              </Message>
            )}
          </Form>
        </Section>

        <Section>
          <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
        </Section>
      </Container>
      <Navigation />
    </PageWrapper>
  );
};

export default Settings;
