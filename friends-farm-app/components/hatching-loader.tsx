"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "./language-provider"

export const HatchingLoader = () => {
    const [isVisible, setIsVisible] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2500)
        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-2xl">
            <style jsx>{`
                .hatching-container {
                    position: relative; width: 140px; height: 140px;
                    display: flex; justify-content: center; align-items: center;
                }
                .egg-shell {
                    position: absolute; width: 70px; height: 55px; background: #fffcf0;
                    border: 2px solid #edebdc; z-index: 3;
                }
                .egg-top {
                    top: 20px; border-radius: 50% 50% 10% 10% / 100% 100% 0% 0%;
                    border-bottom: none; transform-origin: bottom;
                    animation: hatchTop 2.5s infinite ease-in-out;
                }
                .egg-bottom {
                    bottom: 20px; border-radius: 10% 10% 50% 50% / 0% 0% 100% 100%;
                    border-top: none; transform-origin: top;
                    animation: hatchBottom 2.5s infinite ease-in-out;
                }
                .chick {
                    position: absolute; width: 55px; height: 55px; background: #FFEB3B;
                    border-radius: 50%; z-index: 2; display: flex;
                    justify-content: center; align-items: center;
                    animation: chickPop 2.5s infinite ease-in-out;
                    box-shadow: 0 5px 15px rgba(255, 235, 59, 0.3);
                }
                .chick-eye {
                    position: absolute; width: 6px; height: 6px; background: #333;
                    border-radius: 50%; top: 18px;
                }
                .chick-eye.left { left: 15px; }
                .chick-eye.right { right: 15px; }
                .chick-beak {
                    position: absolute; width: 0; height: 0;
                    border-left: 7px solid transparent; border-right: 7px solid transparent;
                    border-top: 8px solid #FF9800; top: 28px;
                }
                @keyframes hatchTop {
                    0%, 30% { transform: translateY(0) rotate(0); }
                    50%, 90% { transform: translateY(-40px) rotate(-20deg); opacity: 0.8; }
                    100% { transform: translateY(0) rotate(0); }
                }
                @keyframes hatchBottom {
                    0%, 30% { transform: translateY(0); }
                    50%, 90% { transform: translateY(15px); }
                    100% { transform: translateY(0); }
                }
                @keyframes chickPop {
                    0%, 30% { transform: translateY(15px) scale(0.6); opacity: 0; }
                    50%, 90% { transform: translateY(-10px) scale(1.1); opacity: 1; }
                    100% { transform: translateY(15px) scale(0.6); opacity: 0; }
                }
                .dots span {
                    animation: dotLoader 1.4s infinite;
                    opacity: 0;
                    display: inline-block;
                    font-size: 2rem;
                    line-height: 0;
                    color: #1B5E20;
                }
                .dots span:nth-child(2) { animation-delay: 0.2s; }
                .dots span:nth-child(3) { animation-delay: 0.4s; }
                .dots span:nth-child(4) { animation-delay: 0.6s; }
                @keyframes dotLoader {
                    0%, 20% { opacity: 0; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-5px); }
                    80%, 100% { opacity: 0; transform: translateY(0); }
                }
            `}</style>

            <div className="hatching-container">
                <div className="chick">
                    <div className="chick-eye left"></div>
                    <div className="chick-eye right"></div>
                    <div className="chick-beak"></div>
                </div>
                <div className="egg-shell egg-top"></div>
                <div className="egg-shell egg-bottom"></div>
            </div>

            <div className="mt-8 flex items-center gap-1">
                <p className="text-2xl font-black text-[#1B5E20] uppercase tracking-tighter">
                    {t("Loading Farm")}
                </p>
                <div className="dots flex gap-1">
                    <span>.</span><span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        </div>
    )
}