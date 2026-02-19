export const inputStyle = {
    borderRadius: 50, 
    height: 50,
    background: "rgb(249, 250, 251)",
    "& input::placeholder": {
        fontSize: "14px"
    },
    color: '#ffffff',
    '& input:-webkit-autofill': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& input:-webkit-autofill:hover': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& input:-webkit-autofill:focus': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& textarea:-webkit-autofill': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& textarea:-webkit-autofill:hover': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& textarea:-webkit-autofill:focus': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& select:-webkit-autofill': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& select:-webkit-autofill:hover': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    },
    '& select:-webkit-autofill:focus': {
        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
    }
}

export const buttonStyle = {
    borderRadius: 50,
    height: 45,
}

export const textButtonStyle = {
    fontSize: "9px"
}