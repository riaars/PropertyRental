import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
const ShareButton = ({ property }: any) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/properties/${property._id}`;

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property
      </h3>
      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag={`#${property.type.replace(/\s/g, "")}ForRent`}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={property.name}
          hashtags={[`${property.type.replace(/\s/g, "")}ForRent`]}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
        <WhatsappShareButton
          url={shareUrl}
          title={property.name}
          separator="::"
        >
          <WhatsappIcon size={32} round={true} />
        </WhatsappShareButton>
        <EmailShareButton
          url={shareUrl}
          subject="Check out this property!"
          body={`Check out this property: ${property.type.replace(/\s/g, "")}`}
        >
          <EmailIcon size={32} round={true} />
        </EmailShareButton>
      </div>
    </>
  );
};

export default ShareButton;
