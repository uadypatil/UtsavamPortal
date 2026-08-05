import { React } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../App.css';

function ChatBot() {

    return (
        <>

            <div className="col-lg-4">
                {/* SEARCH NEARBY EVENTS */}
                <div className="row mt-3 mx-2 card py-4 shadow" style={{ height: '70dvh', display: 'flex', flexDirection: 'column' }}>

                    {/* Chat Header */}
                    <div className="px-3 mb-2">
                        <h5 className="text-center fw-bold">Event Assistant</h5>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-grow-1 overflow-auto px-3" style={{ maxHeight: '350px' }}>
                        {/* Sample messages */}
                        <div className="d-flex flex-column gap-2">
                            <div className="bg-light p-2 rounded align-self-start" style={{ maxWidth: '80%' }}>
                                Hello! How can I help you with nearby events?
                            </div>
                            <div className="bg-primary text-white p-2 rounded align-self-end" style={{ maxWidth: '80%' }}>
                                Show me Ganesh festivals nearby.
                            </div>
                            <div className="bg-light p-2 rounded align-self-start" style={{ maxWidth: '80%' }}>
                                Sure! There’s “Shivtandav Ganeshotsav” happening at Ravivar Karanja, Nashik.
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-top">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type your message..."
                            />
                            <button className="btn btn-primary">Send</button>
                        </div>
                    </div>
                </div>
            </div>

            
        </>
    )
}

export default ChatBot
