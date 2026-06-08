function PreviewMockup({ type }) {
  if (type === 'navbar') {
    return (
      <div className="mockup navbar-mockup">
        <span className="mock-logo" />
        <span /><span /><span />
        <strong />
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="mockup hero-mockup">
        <div>
          <span className="mock-pill" />
          <span className="mock-title" />
          <span className="mock-text" />
          <span className="mock-button" />
        </div>
        <div className="mock-image" />
      </div>
    );
  }

  if (type === 'pricing') {
    return (
      <div className="mockup pricing-mockup">
        <span /><span className="active" /><span />
      </div>
    );
  }

  if (type === 'contact') {
    return (
      <div className="mockup contact-mockup">
        <div /><form><span /><span /><span /></form>
      </div>
    );
  }

  if (type === 'faq') {
    return (
      <div className="mockup faq-mockup">
        <span /><span /><span /><span />
      </div>
    );
  }

  return (
    <div className="mockup card-mockup">
      <span /><span /><span /><span />
    </div>
  );
}

export default PreviewMockup;
