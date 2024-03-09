import React, { useState } from "react";
import { Box, Button, Container, Input, VStack, Heading, Text, FormControl, FormLabel, InputGroup, InputRightElement, useToast, List, ListItem, Image } from "@chakra-ui/react";
import { FaPaperPlane, FaLock, FaUser, FaDollarSign } from "react-icons/fa";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credits, setCredits] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleLogin = async () => {
    // Simulate a login request
    const response = await fetch("https://backengine-h9ao.fly.dev/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      setIsLoggedIn(true);
      toast({
        title: "Logged in successfully!",
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Failed to log in!",
        description: "Please check your credentials.",
        status: "error",
        duration: 2000,
      });
    }
  };

  const handleSendMessage = () => {
    if (credits > 0 && message.trim() !== "") {
      setMessages([...messages, message]);
      setMessage("");
      setCredits(credits - 1);
    } else if (credits === 0) {
      toast({
        title: "No credits left!",
        description: "Please buy more credits to continue chatting.",
        status: "warning",
        duration: 2000,
      });
    }
  };

  const handleBuyCredits = () => {
    // Simulate buying credits
    setCredits(credits + 5);
    toast({
      title: "Credits added!",
      description: "You have purchased 5 credits.",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Container centerContent p={4}>
      <VStack spacing={4} align="stretch">
        {!isLoggedIn ? (
          <>
            <Heading>Welcome to Chakra Chat!</Heading>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <InputRightElement children={<FaLock />} />
              </InputGroup>
            </FormControl>
            <Button leftIcon={<FaUser />} colorScheme="teal" onClick={handleLogin}>
              Login
            </Button>
          </>
        ) : (
          <>
            <Box bg="gray.100" w="100%" p={4} color="black">
              <Heading size="md">Chat Room</Heading>
              <List spacing={3}>
                {messages.map((msg, index) => (
                  <ListItem key={index} bg="blue.100" p={2} borderRadius="md">
                    <Text>{msg}</Text>
                  </ListItem>
                ))}
              </List>
              <FormControl id="message" isDisabled={credits === 0}>
                <InputGroup>
                  <Input
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <InputRightElement children={<FaPaperPlane cursor="pointer" onClick={handleSendMessage} />} />
                </InputGroup>
              </FormControl>
              <Text>Credits: {credits}</Text>
            </Box>
            <Button leftIcon={<FaDollarSign />} colorScheme="green" onClick={handleBuyCredits}>
              Buy Credits
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
