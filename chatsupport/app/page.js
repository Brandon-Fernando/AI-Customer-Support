'use client'
import { Stack, Box, TextField, Button, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Head from 'next/head';



export default function Home() {
  const [messages, setMessages] = useState([
    {
    role: 'assistant',
    content: `Hi, I'm the Gainful Support Agent, how can I assist you today?`,
    },
  ])

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async() => {
    setMessage('')
    setMessages((messages) =>[
      ...messages,
      {role: "user", content: message}, 
      {role: "assistant", content: ''}
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result =''
      return reader.read().then(function processText({done, value}){
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return[
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            },
          ]
        })
        return reader.read().then(processText)
      })
    })

  }

  const handleKeyPress = (event) => {
    if (event.key == 'Enter' && !event.shiftKey){
      event.preventDefault()
      sendMessage()
    }
  }
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])



  return(
    <>
    <Box
    width="100vw"
    height="100vh"
    bgcolor="#F8F4F0"
    display="flex"
    flexDirection="column"
    >

      {/* header */}
      <Box
      maxWidth
      height={90}
      bgcolor={"#204D46"}
      display="flex" 
      alignItems="center"
      justifyContent="center"
      >

        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
            
          }}
          
          alt="Logo"
          src="https://www.gainful.com/_next/image/?url=https%3A%2F%2Fdlye1hka1kz5z.cloudfront.net%2F_next%2Fstatic%2Fmedia%2Flogo-light.082ab69b.webp&w=1200&q=75"
        />
      </Box>
      
      <Box
      sx={{flex: 1}}
      m={5}
      display="flex"
      flexDirection={"row"}
      gap={10}
      >
        {/* Chat History */}
        <Box
        width={320}
        height="100%"
        bgcolor={"white"}
        borderRadius={3}
        display="flex"
        alignItems={"center"}
        flexDirection="column"
        >
          <Typography
          my={2}
          fontWeight="bold"
          >
            Chat History
          </Typography>
          
          <Box
          width={270}
          length={100}
          mb={4}
          >
          <TextField 
          placeholder="Search chats"
          bgcolor="#F5F5F5"
          fullWidth
          value={message}
          sx={{
            "& fieldset": { border: 'none' },
            '& .MuiInputBase-input': {
              backgroundColor: '#F5F5F5', 
            },
            '&:hover fieldset': {
              borderColor: 'green', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#204D46', 
            }
          }}
          />
          </Box>

          <Box
          width={270}
          height={100}
          bgcolor="#204D46"
          borderRadius={3}
          mb={2}
          >
          </Box>
          <Box
          width={270}
          height={100}
          bgcolor="#F5F5F5"
          borderRadius={3}
          mb={2}
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          >
            <Typography variant="h2" color={"#7F928F"}>
              +
            </Typography>
          </Box>

        </Box>

        {/* Chat */}
        <Stack
        sx={{flex: 1}}
        height="100%"
        direction="column"
        p={2}
        spacing={2}
        
        >
          <Stack 
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow="auto"
        maxHeight={530}>
          {
            messages.map((message, index) => (
              <Box key={index} display = "flex" justifyContent={
                message.role == 'assistant' ? 'flex-start' : 'flex-end'
              }>
                <Box bgcolor={
                  message.role == 'assistant' ? 'white' : '#204D46'
                }
                color={message.role == 'assistant' ? 'black' : 'white'}
                borderRadius={4}
                px={3}
                py={2}
                fontSize={13}>
                  {message.content}
                </Box>
              </Box>
            ))
          }
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField 
          placeholder="Ask a question"
          bgcolor="white"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{
            "& fieldset": { border: 'none' },
            '& .MuiInputBase-input': {
              backgroundColor: 'white', 
            },
            '&:hover fieldset': {
              borderColor: 'green', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#204D46', 
            }
          }}
          />
          <Button 
          variant="outlined"
          onClick={sendMessage}
          sx={{bgcolor: "#DBDE8D", borderColor: "#DBDE8D", color: "white",
              '&:hover':{bgcolor: "#76915e", borderColor: "#76915e"} }}
          >
            Send
          </Button>
          
        </Stack>
          
        </Stack>
      </Box>
    </Box>


    </>
  )
}
