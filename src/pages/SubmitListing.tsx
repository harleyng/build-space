import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ListingFormBasic } from "@/components/listings/ListingFormBasic";
import { ListingFormAddress } from "@/components/listings/ListingFormAddress";
import { ListingFormAttributes } from "@/components/listings/ListingFormAttributes";
import { ListingFormContact } from "@/components/listings/ListingFormContact";
import { ListingFormImages } from "@/components/listings/ListingFormImages";
import { Purpose, PriceUnit } from "@/types/listing.types";

const SubmitListing = () => {
  const navigate = useNavigate();
  const { id: listingId } = useParams();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!listingId;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("TOTAL");
  const [area, setArea] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("FOR_SALE");
  const [propertyTypeSlug, setPropertyTypeSlug] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [prominentFeatures, setProminentFeatures] = useState("");
  
  // Organization ownership
  const [ownershipType, setOwnershipType] = useState<"personal" | "organization">("personal");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<any[]>([]);
  
  // Dynamic attributes
  const [numBedrooms, setNumBedrooms] = useState("");
  const [numBathrooms, setNumBathrooms] = useState("");
  const [numFloors, setNumFloors] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [houseDirection, setHouseDirection] = useState("");
  const [balconyDirection, setBalconyDirection] = useState("");
  const [landDirection, setLandDirection] = useState("");
  const [facadeWidth, setFacadeWidth] = useState("");
  const [alleyWidth, setAlleyWidth] = useState("");
  const [legalStatus, setLegalStatus] = useState("");
  const [interiorStatus, setInteriorStatus] = useState("");
  const [landType, setLandType] = useState("");

  const { data: propertyTypes } = usePropertyTypes();
  const {
    images,
    imagePreviewUrls,
    uploadingImages,
    handleImageSelect,
    removeImage,
    uploadImages: uploadImagesToStorage,
  } = useImageUpload();

  // Auth check and load listing if edit mode
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setSession(session);
      setContactEmail(session.user.email || "");
      
      // Fetch user profile for name
      supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.name) setContactName(data.name);
        });

      // Load listing data if edit mode
      if (isEditMode && listingId) {
        loadListing(listingId, session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, isEditMode, listingId]);

  const loadListing = async (id: string, userId: string) => {
    const { data: listing, error } = await supabase
      .from("listings")
      .select("*, listing_contacts(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !listing) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin tin đăng",
        variant: "destructive",
      });
      navigate("/portal/properties");
      return;
    }

    // Populate form with listing data
    setTitle(listing.title);
    setDescription(listing.description || "");
    setPrice(listing.price?.toString() || "");
    setPriceUnit(listing.price_unit);
    setArea(listing.area?.toString() || "");
    setPurpose(listing.purpose as Purpose);
    setPropertyTypeSlug(listing.property_type_slug);
    setProjectName(listing.project_name || "");
    setProminentFeatures(listing.prominent_features?.join(", ") || "");
    
    // Address
    const address = listing.address as any;
    setProvince(address?.province || "");
    setDistrict(address?.district || "");
    setWard(address?.ward || "");
    setStreet(address?.street || "");
    
    // Attributes
    const attrs = listing.attributes as any || {};
    setNumBedrooms(attrs.num_bedrooms?.toString() || "");
    setNumBathrooms(attrs.num_bathrooms?.toString() || "");
    setNumFloors(attrs.num_floors?.toString() || "");
    setFloorNumber(attrs.floor_number?.toString() || "");
    setHouseDirection(attrs.house_direction || "");
    setBalconyDirection(attrs.balcony_direction || "");
    setLandDirection(attrs.land_direction || "");
    setFacadeWidth(attrs.facade_width?.toString() || "");
    setAlleyWidth(attrs.alley_width?.toString() || "");
    setLegalStatus(attrs.legal_status || "");
    setInteriorStatus(attrs.interior_status || "");
    setLandType(attrs.land_type || "");

    // Contact info
    const contacts = listing.listing_contacts as any;
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      const contact = contacts[0].contact_info as any;
      setContactName(contact?.name || "");
      setContactPhone(contact?.phone || "");
      setContactEmail(contact?.email || "");
    }
  };

  const filteredPropertyTypes = propertyTypes?.filter((type) => {
    const metadata = type.filter_metadata as any;
    return metadata?.[purpose]?.available === true;
  }) || [];

  const currentPropertyType = propertyTypes?.find(pt => pt.slug === propertyTypeSlug);
  const currentFilters = currentPropertyType?.filter_metadata?.[purpose]?.filters || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!title.trim() || !description.trim() || !price || !area || !district) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (!isEditMode && images.length === 0) {
      toast({
        title: "Thiếu hình ảnh",
        description: "Vui lòng tải lên ít nhất 1 hình ảnh",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (images.length > 0) {
        imageUrl = await uploadImagesToStorage(session.user.id);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      const listingData: any = {
        user_id: session.user.id,
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        price_unit: priceUnit,
        area: parseFloat(area),
        address: {
          province: province.trim() || null,
          district: district.trim(),
          ward: ward.trim() || null,
          street: street.trim() || null,
        },
        prominent_features: prominentFeatures ? prominentFeatures.split(',').map(f => f.trim()) : null,
        purpose,
        property_type_slug: propertyTypeSlug,
        ...(imageUrl && { image_url: imageUrl }),
        project_name: projectName.trim() || null,
        status: 'PENDING_APPROVAL' as any,
        attributes: {
          num_bedrooms: numBedrooms ? parseInt(numBedrooms) : null,
          num_bathrooms: numBathrooms ? parseInt(numBathrooms) : null,
          num_floors: numFloors ? parseInt(numFloors) : null,
          floor_number: floorNumber ? parseInt(floorNumber) : null,
          house_direction: houseDirection || null,
          balcony_direction: balconyDirection || null,
          land_direction: landDirection || null,
          facade_width: facadeWidth ? parseFloat(facadeWidth) : null,
          alley_width: alleyWidth ? parseFloat(alleyWidth) : null,
          legal_status: legalStatus || null,
          interior_status: interiorStatus || null,
          land_type: landType || null,
        },
        num_bedrooms: numBedrooms ? parseInt(numBedrooms) : null,
        num_bathrooms: numBathrooms ? parseInt(numBathrooms) : null,
        num_floors: numFloors ? parseInt(numFloors) : null,
        floor_number: floorNumber ? parseInt(floorNumber) : null,
        house_direction: houseDirection || null,
        balcony_direction: balconyDirection || null,
        land_direction: landDirection || null,
        facade_width: facadeWidth ? parseFloat(facadeWidth) : null,
        alley_width: alleyWidth ? parseFloat(alleyWidth) : null,
        legal_status: legalStatus || null,
        interior_status: interiorStatus || null,
        land_type: landType || null,
      };

      if (isEditMode && listingId) {
        const { error: listingError } = await supabase
          .from("listings")
          .update(listingData)
          .eq("id", listingId);

        if (listingError) throw listingError;

        await supabase
          .from("listing_contacts")
          .update({
            contact_info: {
              name: contactName.trim(),
              phone: contactPhone.trim(),
              email: contactEmail.trim(),
            },
          })
          .eq("listing_id", listingId);

        toast({
          title: "Cập nhật thành công",
          description: "Tin đăng đã được cập nhật",
        });
      } else {
        const { data: newListing, error: listingError } = await supabase
          .from("listings")
          .insert(listingData)
          .select()
          .single();

        if (listingError) throw listingError;

        await supabase.from("listing_contacts").insert({
          listing_id: newListing.id,
          contact_info: {
            name: contactName.trim(),
            phone: contactPhone.trim(),
            email: contactEmail.trim(),
          },
        });

        toast({
          title: "Đăng tin thành công",
          description: "Tin đăng của bạn đang chờ duyệt",
        });
      }

      navigate("/portal/properties");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            {isEditMode ? "Chỉnh sửa tin đăng" : "Đăng tin bất động sản"}
          </CardTitle>
          <CardDescription>Điền thông tin chi tiết về bất động sản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Mục đích <span className="text-destructive">*</span></Label>
              <Tabs value={purpose} onValueChange={(v) => setPurpose(v as Purpose)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="FOR_SALE">Bán</TabsTrigger>
                  <TabsTrigger value="FOR_RENT">Cho thuê</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Loại hình BĐS <span className="text-destructive">*</span></Label>
              <Select value={propertyTypeSlug} onValueChange={setPropertyTypeSlug} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPropertyTypes.map((type) => (
                    <SelectItem key={type.slug} value={type.slug}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ListingFormBasic
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              price={price}
              setPrice={setPrice}
              priceUnit={priceUnit}
              setPriceUnit={setPriceUnit}
              area={area}
              setArea={setArea}
              prominentFeatures={prominentFeatures}
              setProminentFeatures={setProminentFeatures}
              projectName={projectName}
              setProjectName={setProjectName}
            />

            <ListingFormAddress
              province={province}
              setProvince={setProvince}
              district={district}
              setDistrict={setDistrict}
              ward={ward}
              setWard={setWard}
              street={street}
              setStreet={setStreet}
            />

            {propertyTypeSlug && (
              <ListingFormAttributes
                currentFilters={currentFilters}
                numBedrooms={numBedrooms}
                setNumBedrooms={setNumBedrooms}
                numBathrooms={numBathrooms}
                setNumBathrooms={setNumBathrooms}
                numFloors={numFloors}
                setNumFloors={setNumFloors}
                floorNumber={floorNumber}
                setFloorNumber={setFloorNumber}
                houseDirection={houseDirection}
                setHouseDirection={setHouseDirection}
                balconyDirection={balconyDirection}
                setBalconyDirection={setBalconyDirection}
                landDirection={landDirection}
                setLandDirection={setLandDirection}
                facadeWidth={facadeWidth}
                setFacadeWidth={setFacadeWidth}
                alleyWidth={alleyWidth}
                setAlleyWidth={setAlleyWidth}
                legalStatus={legalStatus}
                setLegalStatus={setLegalStatus}
                interiorStatus={interiorStatus}
                setInteriorStatus={setInteriorStatus}
                landType={landType}
                setLandType={setLandType}
              />
            )}

            <ListingFormContact
              contactName={contactName}
              setContactName={setContactName}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
            />

            <ListingFormImages
              imagePreviewUrls={imagePreviewUrls}
              onImageSelect={handleImageSelect}
              onRemoveImage={removeImage}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || uploadingImages}
              size="lg"
            >
              {(loading || uploadingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploadingImages ? "Đang tải ảnh..." : (isEditMode ? "Cập nhật" : "Đăng tin")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitListing;
