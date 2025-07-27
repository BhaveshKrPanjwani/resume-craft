import { useState, useEffect } from 'react';
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
import './styles/ats-resume.css';

const { Header, Content, Footer, Sider } = Layout;

const EditorWithNavigation = () => {
  const navigate = useNavigate();
  return <EditorLayout />;
};

const PreviewWithNavigation = () => {
  const navigate = useNavigate();
  return <PreviewLayout onBack={() => navigate('/')} />;
};

const AppContent = ({ darkMode }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { resumeMetadata } = useResumeStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSave = () => {
    console.log('Save triggered from AppContent');
  };

  const menuItems = [
    { key: '/', label: 'Editor', onClick: () => navigate('/') },
    { key: '/preview', label: 'Preview', onClick: () => navigate('/preview') },
  ];

  return (
    <Layout className={darkMode ? 'app-layout dark-mode' : 'app-layout'}>
      <Header className="app-header">
        <div className="header-content">
          {/* <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="sider-toggle"
          /> */}
          <h1 className="site-title">ResumeCraft Pro</h1>
          <div className="header-actions">
            <Button
              className="dark-mode-toggle"
              onClick={() => window.dispatchEvent(new CustomEvent('toggleDarkMode'))}
              icon={<span>{darkMode ? '☀️' : '🌙'}</span>}
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
        className="app-toolbar"
      />
      <Layout className="main-layout">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          collapsedWidth={0}
          className="app-sider"
          width={200}
          style={{ position: 'fixed', height: 'calc(100vh - 64px - 48px - 15px)', zIndex: 999, top: 'calc(64px + 48px + 15px)' }}
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
        <Content className="app-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<EditorWithNavigation />} />
              <Route path="/preview" element={<PreviewWithNavigation />} />
              <Route path="/ai-review" element={<AIAssistantLayout />} />
              <Route path="/cover-letter" element={<CoverLetterLayout />} />
            </Routes>
          </div>
        </Content>
      </Layout>
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
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Handle dark mode toggle via custom event
  useEffect(() => {
    const handleToggle = () => setDarkMode((prev) => !prev);
    window.addEventListener('toggleDarkMode', handleToggle);
    return () => window.removeEventListener('toggleDarkMode', handleToggle);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: useResumeStore.getState().resumeMetadata.colorScheme || '#0A66C2',
          fontFamily: 'Inter, Roboto, sans-serif',
          borderRadius: 6,
          colorBgContainer: darkMode ? '#1E1E1E' : '#F7F9FC',
          colorText: darkMode ? '#E6E6E6' : '#1F2A44',
          colorBorder: darkMode ? '#434343' : '#DDE2E8',
          colorBgElevated: darkMode ? '#1E1E1E' : '#FFFFFF',
          colorTextSecondary: darkMode ? '#A0A0A0' : '#6B7280',
        },
      }}
    >
      <Router>
        <AppContent darkMode={darkMode} />
      </Router>
    </ConfigProvider>
  );
}

export default App;