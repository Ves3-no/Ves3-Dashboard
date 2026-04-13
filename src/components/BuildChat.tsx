function buildChat(messageRole: string, message: any) {
    if (messageRole === 'user') {
        return(<>
        <p className="Role">You</p>
        <p className="Message">{message}</p>
        </>)
    } else if (messageRole === 'assistant') {
        return(<>
        <p className="Role">Assistant</p>
        <p className="Message">{message}</p>
        </>)       
    } 
}
export default buildChat