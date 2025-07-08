import { useState } from 'react';
import { Layout, ConfigProvider, theme, Menu, Button } from 'antd';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import useResumeStore from './stores/useResumeStore';
import PreviewLayout from './components/preview/ResumePreview';
import EditorLayout from './components/editor/ResumeForm';
import AIAssistantLayout from './components/ai/AIReview';
import CoverLetterLayout from './components/ai/CoverLetterGenerator';
import Toolbar from './components/editor/Toolbar';
import './styles/global.css';

const { Header, Content, Footer, Sider } = Layout;

const EditorWithNavigation = () => {
  const navigate = useNavigate();
  return <EditorLayout />;
};

const PreviewWithNavigation = () => {
  const navigate = useNavigate();
  return <PreviewLayout onBack={() => navigate('/')} />;
};

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { resumeMetadata } = useResumeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSave = () => {
    // This could be enhanced to persist data (e.g., to localStorage or API)
    console.log('Save triggered from AppContent');
  };

  const menuItems = [
    { key: '/', label: 'Editor', onClick: () => navigate('/') },
    { key: '/preview', label: 'Preview', onClick: () => navigate('/preview') },
    { key: '/ai-review', label: 'AI Review', onClick: () => navigate('/ai-review') },
    { key: '/cover-letter', label: 'Cover Letter', onClick: () => navigate('/cover-letter') },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: resumeMetadata.colorScheme || '#0A66C2',
          fontFamily: 'Inter, Roboto, sans-serif',
          borderRadius: 6,
          colorBgContainer: darkMode ? '#1F252D' : '#F7F9FC',
          colorText: darkMode ? '#E0E7F0' : '#1F2A44',
          colorBorder: darkMode ? '#3A4350' : '#DDE2E8',
        },
      }}
    >
      <Layout className={`app-layout ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          collapsedWidth={0}
          className="app-sider"
        >
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="sider-menu"
          />
        </Sider>
        <Layout>
          <Header className="app-header">
            <div className="header-content">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="sider-toggle"
              />
              <h1 className="site-title">ResumeCraft Pro</h1>
              <div className="header-actions">
                <Button
                  className="dark-mode-toggle"
                  onClick={() => setDarkMode(!darkMode)}
                  icon={darkMode ? <span>☀️</span> : <span>🌙</span>}
                >
                  {darkMode ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
          </Header>
          <Toolbar
            onPreview={() => navigate('/preview')}
            onSave={handleSave}
            onReset={() => useResumeStore.getState().reset()}
          />
          <Content className="app-content">
            <Routes>
              <Route path="/" element={<EditorWithNavigation />} />
              <Route path="/preview" element={<PreviewWithNavigation />} />
              <Route path="/ai-review" element={<AIAssistantLayout />} />
              <Route path="/cover-letter" element={<CoverLetterLayout />} />
            </Routes>
          </Content>
          <Footer className="app-footer">
            <div className="footer-content">
              <span>© 2025 ResumeCraft Pro</span>
              <div className="footer-links">
                <a href="/privacy">Privacy Policy</a>
                <a href="/support">Support</a>
              </div>
            </div>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;