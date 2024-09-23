"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { updateProfile } from "@/actions/updateProfileAction";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Briefcase,
  CreditCard,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  image?: string | null;
  name?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
}

interface CompleteUserInfo {
  firstName: string;
  lastName: string;
  address: string | null;
  id: number;
  role: string;
  email: string;
  phoneNumber: string | null;
  membershipStatus: string;
  password: string | null;
}

export default function ProfileForm({
  user,
  completeUserInfo,
}: {
  user: User;
  completeUserInfo: CompleteUserInfo | undefined;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("ProfileForm");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsDialogOpen(false);
        toast({
          title: t("profileUpdated"),
          description: result.message,
          duration: 3000,
          className: "bg-rose-500 text-white",
        });
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("updateFailed"),
        description:
          error instanceof Error ? error.message : t("unableToUpdate"),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-3xl mx-auto shadow-lg bg-white overflow-hidden">
        <div className="bg-rose-600 h-32"></div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-16 mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg mb-4 mt-4">
              <Image
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
                width={128}
                height={128}
                objectFit="cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {completeUserInfo?.firstName} {completeUserInfo?.lastName}
            </h2>
            <p className="text-xl text-rose-600 font-medium mt-1">
              {completeUserInfo?.role || t("roleNotSpecified")}
            </p>
            <div className="mt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <Edit2 className="h-5 w-5 mr-2" />
                    {t("editProfile")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-rose-800">
                      {t("editProfile")}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-rose-700 mb-1"
                        >
                          {t("firstName")}
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder={t("firstName")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-rose-700 mb-1"
                        >
                          {t("lastName")}
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder={t("lastName")}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-rose-700 mb-1"
                      >
                        {t("phone")}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={t("phone")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-rose-700 mb-1"
                      >
                        {t("address")}
                      </label>
                      <input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={t("address")}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                      {t("saveChanges")}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileItem
              icon={CreditCard}
              label={t("id")}
              value={completeUserInfo?.id.toString() || t("notAvailable")}
            />
            <ProfileItem
              icon={Mail}
              label={t("email")}
              value={completeUserInfo?.email || t("notProvided")}
            />
            <ProfileItem
              icon={Phone}
              label={t("phone")}
              value={completeUserInfo?.phoneNumber || t("notProvided")}
            />
            <ProfileItem
              icon={MapPin}
              label={t("address")}
              value={completeUserInfo?.address || t("notProvided")}
            />
            <ProfileItem
              icon={Briefcase}
              label={t("membership")}
              value={completeUserInfo?.membershipStatus || t("notSpecified")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-rose-50 p-4 rounded-lg">
      <Icon className="h-6 w-6 text-rose-500 flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-sm text-rose-700 font-semibold">{label}</p>
        <p className="text-base text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
