"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Manage your profile and account preferences.</p>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
          <CardTitle className="text-xl font-bold">Profile Info</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
           <p className="text-gray-600">This page is under construction.</p>
           <Button className="mt-4 rounded-xl">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
