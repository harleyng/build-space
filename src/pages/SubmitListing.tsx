import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubmitListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"TOTAL" | "PER_SQM" | "PER_MONTH">("TOTAL");
  const [area, setArea] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [purpose, setPurpose] = useState<"FOR_SALE" | "FOR_RENT">("FOR_SALE");
  const [propertyTypeSlug, setPropertyTypeSlug] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [prominentFeatures, setProminentFeatures] = useState("");
  
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

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const { data: propertyTypes } = usePropertyTypes();

  // Auth check
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
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Filter property types based on purpose
  const filteredPropertyTypes = propertyTypes?.filter((type) => {
    const metadata = type.filter_metadata as any;
    return metadata?.[purpose]?.available === true;
  }) || [];

  // Get current property type metadata
  const currentPropertyType = propertyTypes?.find(pt => pt.slug === propertyTypeSlug);
  const currentFilters = currentPropertyType?.filter_metadata?.[purpose]?.filters || [];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast({
        title: "Quá nhiều ảnh",
        description: "Bạn chỉ có thể tải lên tối đa 10 ảnh",
        variant: "destructive",
      });
      return;
    }

    setImages([...images, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(newPreviews);
  };

  const uploadImages = async (userId: string): Promise<string | null> => {
    if (images.length === 0) return null;

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls[0]; // Return first image as main image
    } catch (error: any) {
      toast({
        title: "Lỗi tải ảnh",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    // Validation
    if (!title.trim() || !description.trim() || !price || !area || !district) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Thiếu hình ảnh",
        description: "Vui lòng tải lên ít nhất 1 hình ảnh",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const imageUrl = await uploadImages(session.user.id);
      if (!imageUrl) {
        setLoading(false);
        return;
      }

      // Create listing with new schema
      const { data: newListing, error: listingError } = await supabase.from("listings").insert({
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
        image_url: imageUrl,
        project_name: projectName.trim() || null,
        status: 'PENDING_APPROVAL',
        // Dynamic attributes stored in attributes column
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
        // Keep backward compatibility for filtering
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
      }).select().single();

      if (listingError) throw listingError;

      // Store contact info in the secure listing_contacts table
      const { error: contactError } = await supabase.from("listing_contacts").insert({
        listing_id: newListing.id,
        contact_info: {
          name: contactName.trim(),
          phone: contactPhone.trim(),
          email: contactEmail.trim(),
        },
      });

      if (contactError) throw contactError;

      toast({
        title: "Đăng tin thành công",
        description: "Tin đăng của bạn đang chờ duyệt",
      });

      navigate("/listings");
    } catch (error: any) {
      toast({
        title: "Lỗi đăng tin",
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

  const directions = ["Đông", "Tây", "Nam", "Bắc", "Đông Bắc", "Tây Bắc", "Đông Nam", "Tây Nam"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Đăng tin bất động sản</CardTitle>
            <CardDescription>Điền thông tin chi tiết về bất động sản của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Purpose Selection */}
              <div className="space-y-2">
                <Label>Mục đích <span className="text-destructive">*</span></Label>
                <Tabs value={purpose} onValueChange={(v) => setPurpose(v as "FOR_SALE" | "FOR_RENT")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="FOR_SALE">Bán</TabsTrigger>
                    <TabsTrigger value="FOR_RENT">Cho thuê</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Property Type */}
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

              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề tin đăng <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Bán căn hộ cao cấp 2PN tại quận 1"
                  required
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết về bất động sản..."
                  rows={6}
                  required
                  maxLength={5000}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá <span className="text-destructive">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="VD: 5000000000"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceUnit">Đơn vị tính giá <span className="text-destructive">*</span></Label>
                  <Select value={priceUnit} onValueChange={(v: any) => setPriceUnit(v)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOTAL">Tổng giá</SelectItem>
                      <SelectItem value="PER_SQM">VND/m²</SelectItem>
                      <SelectItem value="PER_MONTH">VND/tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Diện tích (m²) <span className="text-destructive">*</span></Label>
                  <Input
                    id="area"
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="VD: 80"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Địa chỉ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Input
                      id="province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="VD: TP. Hồ Chí Minh"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện <span className="text-destructive">*</span></Label>
                    <Input
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="VD: Quận 1"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Input
                      id="ward"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="VD: Phường Bến Nghé"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Số nhà, đường</Label>
                    <Input
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="VD: 123 Nguyễn Huệ"
                      maxLength={200}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prominentFeatures">Đặc điểm nổi bật</Label>
                <Input
                  id="prominentFeatures"
                  value={prominentFeatures}
                  onChange={(e) => setProminentFeatures(e.target.value)}
                  placeholder="VD: Gần trường học, View đẹp, An ninh 24/7 (cách nhau bởi dấu phẩy)"
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Tên dự án (nếu có)</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="VD: Vinhomes Central Park"
                  maxLength={200}
                />
              </div>

              {/* Dynamic Attributes */}
              {propertyTypeSlug && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Thông tin chi tiết</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentFilters.includes("numBedrooms") && (
                      <div className="space-y-2">
                        <Label htmlFor="numBedrooms">Số phòng ngủ</Label>
                        <Input
                          id="numBedrooms"
                          type="number"
                          value={numBedrooms}
                          onChange={(e) => setNumBedrooms(e.target.value)}
                          min="0"
                        />
                      </div>
                    )}

                    {currentFilters.includes("numBathrooms") && (
                      <div className="space-y-2">
                        <Label htmlFor="numBathrooms">Số phòng vệ sinh</Label>
                        <Input
                          id="numBathrooms"
                          type="number"
                          value={numBathrooms}
                          onChange={(e) => setNumBathrooms(e.target.value)}
                          min="0"
                        />
                      </div>
                    )}

                    {currentFilters.includes("numFloors") && (
                      <div className="space-y-2">
                        <Label htmlFor="numFloors">Số tầng</Label>
                        <Input
                          id="numFloors"
                          type="number"
                          value={numFloors}
                          onChange={(e) => setNumFloors(e.target.value)}
                          min="0"
                        />
                      </div>
                    )}

                    {currentFilters.includes("floorNumber") && (
                      <div className="space-y-2">
                        <Label htmlFor="floorNumber">Tầng số</Label>
                        <Input
                          id="floorNumber"
                          type="number"
                          value={floorNumber}
                          onChange={(e) => setFloorNumber(e.target.value)}
                          min="0"
                        />
                      </div>
                    )}

                    {currentFilters.includes("houseDirection") && (
                      <div className="space-y-2">
                        <Label htmlFor="houseDirection">Hướng nhà</Label>
                        <Select value={houseDirection} onValueChange={setHouseDirection}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hướng" />
                          </SelectTrigger>
                          <SelectContent>
                            {directions.map((dir) => (
                              <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {currentFilters.includes("balconyDirection") && (
                      <div className="space-y-2">
                        <Label htmlFor="balconyDirection">Hướng ban công</Label>
                        <Select value={balconyDirection} onValueChange={setBalconyDirection}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hướng" />
                          </SelectTrigger>
                          <SelectContent>
                            {directions.map((dir) => (
                              <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {currentFilters.includes("landDirection") && (
                      <div className="space-y-2">
                        <Label htmlFor="landDirection">Hướng đất</Label>
                        <Select value={landDirection} onValueChange={setLandDirection}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hướng" />
                          </SelectTrigger>
                          <SelectContent>
                            {directions.map((dir) => (
                              <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {currentFilters.includes("facadeWidth") && (
                      <div className="space-y-2">
                        <Label htmlFor="facadeWidth">Chiều rộng mặt tiền (m)</Label>
                        <Input
                          id="facadeWidth"
                          type="number"
                          value={facadeWidth}
                          onChange={(e) => setFacadeWidth(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    )}

                    {currentFilters.includes("alleyWidth") && (
                      <div className="space-y-2">
                        <Label htmlFor="alleyWidth">Chiều rộng đường vào (m)</Label>
                        <Input
                          id="alleyWidth"
                          type="number"
                          value={alleyWidth}
                          onChange={(e) => setAlleyWidth(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    )}

                    {currentFilters.includes("legalStatus") && (
                      <div className="space-y-2">
                        <Label htmlFor="legalStatus">Pháp lý</Label>
                        <Select value={legalStatus} onValueChange={setLegalStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn pháp lý" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sổ hồng">Sổ hồng</SelectItem>
                            <SelectItem value="Sổ đỏ">Sổ đỏ</SelectItem>
                            <SelectItem value="HĐMB">HĐMB</SelectItem>
                            <SelectItem value="Đang chờ sổ">Đang chờ sổ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {currentFilters.includes("interiorStatus") && (
                      <div className="space-y-2">
                        <Label htmlFor="interiorStatus">Tình trạng nội thất</Label>
                        <Select value={interiorStatus} onValueChange={setInteriorStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tình trạng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full nội thất">Full nội thất</SelectItem>
                            <SelectItem value="Nội thất cơ bản">Nội thất cơ bản</SelectItem>
                            <SelectItem value="Không nội thất">Không nội thất</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {currentFilters.includes("landType") && (
                      <div className="space-y-2">
                        <Label htmlFor="landType">Loại đất</Label>
                        <Select value={landType} onValueChange={setLandType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại đất" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Đất thổ cư">Đất thổ cư</SelectItem>
                            <SelectItem value="Đất nông nghiệp">Đất nông nghiệp</SelectItem>
                            <SelectItem value="Đất thương mại dịch vụ">Đất thương mại dịch vụ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Thông tin liên hệ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Tên liên hệ <span className="text-destructive">*</span></Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Số điện thoại <span className="text-destructive">*</span></Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ <span className="text-destructive">*</span></Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Hình ảnh <span className="text-destructive">*</span></Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nhấn để chọn ảnh (tối đa 10 ảnh)
                    </p>
                  </label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || uploadingImages}
                size="lg"
              >
                {(loading || uploadingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploadingImages ? "Đang tải ảnh..." : "Đăng tin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitListing;
