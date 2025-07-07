import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntdApp } from 'antd';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 4,
          colorBgContainer: '#ffffff',
        },
        components: {
          Button: {
            colorPrimary: '#00b96b',
            algorithm: true, // Enable algorithm
          },
        },
        cssVar: true, // Enable CSS variables
      }}
    >
      <AntdApp notification={{ placement: 'topRight' }}>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);