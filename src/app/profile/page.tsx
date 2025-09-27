import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-temple py-12">
      <div className="relative">
        {/* Greek columns decoration */}
        <div className="absolute inset-0 flex justify-around items-end opacity-5">
          <div className="greek-column w-4 h-full"></div>
          <div className="greek-column w-4 h-full"></div>
          <div className="greek-column w-4 h-full"></div>
          <div className="greek-column w-4 h-full"></div>
        </div>
        
        <div className="relative z-10">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}