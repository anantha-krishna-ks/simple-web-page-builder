import React from 'react';
import PDFViewer from '../components/PDFViewer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Footer from '../components/Footer';

const PDFViewPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Mathematics Grade 4 - Chapter 4</CardTitle>
          </CardHeader>
          <CardContent>
            <PDFViewer />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PDFViewPage;
