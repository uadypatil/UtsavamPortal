import React from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/UtsavamLogoMain.png";
import ganesha from "../../assets/animatedganesha.png";

import { COLORS } from "../../constants/colors";

const NotFound = () => {
    return (
        <div
            className="min-vh-100 position-relative overflow-hidden d-flex align-items-center"
            style={{
                background: COLORS.background,
            }}
        >
            {/* Decorative Glow */}
            <div
                style={{
                    position: "absolute",
                    top: -180,
                    left: -180,
                    width: 420,
                    height: 420,
                    borderRadius: "50%",
                    background: COLORS.secondary,
                    opacity: 0.08,
                    filter: "blur(90px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: -150,
                    right: -150,
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: COLORS.primary,
                    opacity: 0.08,
                    filter: "blur(90px)",
                }}
            />

            <div className="container">
                <div className="row align-items-center">

                    {/* Left */}

                    <div className="col-lg-6 text-center text-lg-start">

                        <img
                            src={logo}
                            alt="Utsavam"
                            style={{
                                width: 220,
                                marginBottom: 30,
                            }}
                        />

                        <h1
                            style={{
                                fontSize: "7rem",
                                fontWeight: 900,
                                color: COLORS.primary,
                                lineHeight: 1,
                            }}
                        >
                            404
                        </h1>

                        <h2
                            style={{
                                color: COLORS.charcoal,
                                fontWeight: 700,
                            }}
                        >
                            The celebration is not here...
                        </h2>

                        <p
                            className="mt-3"
                            style={{
                                maxWidth: 550,
                                color: "#666",
                                fontSize: "1.05rem",
                            }}
                        >
                            Looks like this path doesn't lead to a festival.
                            Lord Ganesha will gladly guide you back to the
                            celebrations.
                        </p>

                        <div className="mt-4 d-flex gap-3 flex-wrap">

                            <Link
                                to="/"
                                className="btn btn-lg"
                                style={{
                                    background: COLORS.primary,
                                    color: "#fff",
                                    borderRadius: 50,
                                    padding: "12px 32px",
                                }}
                            >
                                🏠 Back to Home
                            </Link>

                            <Link
                                to="/events"
                                className="btn btn-lg"
                                style={{
                                    border: `2px solid ${COLORS.secondary}`,
                                    color: COLORS.primary,
                                    borderRadius: 50,
                                    padding: "12px 32px",
                                }}
                            >
                                Explore Events
                            </Link>

                        </div>

                        <div
                            className="mt-5"
                            style={{
                                color: COLORS.accent,
                                fontWeight: 600,
                                letterSpacing: 1,
                            }}
                        >
                            🙏 Ganpati Bappa Morya 🙏
                        </div>

                    </div>

                    {/* Right */}

                    <div className="col-lg-6 text-center">

                        <img
                            src={ganesha}
                            alt="Lord Ganesha"
                            className="img-fluid"
                            style={{
                                maxHeight: 600,
                                animation: "float 4s ease-in-out infinite",
                            }}
                        />

                    </div>

                </div>
            </div>

            <style>{`
                @keyframes float{
                    0%{transform:translateY(0);}
                    50%{transform:translateY(-12px);}
                    100%{transform:translateY(0);}
                }

                .btn:hover{
                    transform:translateY(-2px);
                    transition:.25s;
                }
            `}</style>
        </div>
    );
};

export default NotFound;