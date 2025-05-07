import type { NextConfig } from "next";


const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000", // 로컬 개발 환경
      "http://192.168.219.113:3000", // 로컬 개발 환경
      "http://116.32.103.132:9000/" // 허용할 개발용 사이트
    ],
  },
};


export default nextConfig;



