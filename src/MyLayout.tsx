import { Layout } from 'antd';
import React from 'react';
import MyApp from './MyApp';

const { Header, Content, } = Layout;

const MyLayout: React.FC = () => (
    <Layout hasSider>
        <Layout className="site-layout" >
            <Content style={{ overflow: 'initial' }}>
                <div className="site-layout-background" style={{ padding: 1, textAlign: 'center' }}>
                    <MyApp />
                </div>
            </Content>
        </Layout>
    </Layout>
);

export default MyLayout;