export const MapEmbed = ({ lat, lng }: { lat: number; lng: number }) => {
    const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    return (
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    );
  };